const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const cp = require('node:child_process');
const assert = require('node:assert/strict');
process.chdir(path.resolve(__dirname, '..'));
cp.execFileSync(process.execPath, ['tools/build.cjs', '--check']);
for (const file of ['game.bundle.js', 'learning-gate.js', 'pwa.js', 'sw.js', 'vendor/phaser.min.js']) new vm.Script(fs.readFileSync(file, 'utf8'), {filename: file});
const html = fs.readFileSync('index.html','utf8');
assert(!html.includes('cdn.jsdelivr.net'));
assert(html.includes('https://cmlozanos.github.io/games/'));
assert(html.indexOf('learning-gate.js') < html.indexOf('game.bundle.js'));
const game = fs.readFileSync('src/game.js','utf8');
assert(!game.includes('bgGraphics'));
assert(game.includes('game.pause()') && game.includes('game.resume()'));
const constants = fs.readFileSync('src/constants.js','utf8').replace(/^export /gm,'');
const models = vm.runInNewContext(constants + '\n;({PLAYER,PHYSICS,WORLD,LEVELS})', {Phaser:{Scale:{RESIZE:5,CENTER_BOTH:1}}});
assert.equal(models.LEVELS.PRESETS.length,50);
const rise = models.PLAYER.JUMP_POWER ** 2 / (2 * (models.PLAYER.GRAVITY + models.PHYSICS.GRAVITY_Y));
for (const level of models.LEVELS.PRESETS) {
  assert(level.goalHeight < 600 * models.WORLD.HEIGHT_MULTIPLIER - models.WORLD.GROUND_Y_OFFSET);
  let previous = 0;
  for (const platform of level.platforms) { assert(platform.y - previous <= rise, 'Unreachable vertical gap'); previous = platform.y; }
}
const sw = {self: {addEventListener() {}}}; vm.runInNewContext(fs.readFileSync('sw.js','utf8'),sw);
for (const file of sw.FILES) assert(fs.existsSync(file.split('?')[0]), file);
assert(sw.CACHE.startsWith('banana-party-'));
console.log('PASS syntax, generated bundle, local assets, gate bootstrap, bounded background and PWA files');
