const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const cp = require('node:child_process');
const assert = require('node:assert/strict');
process.chdir(path.resolve(__dirname, '..'));
cp.execFileSync(process.execPath, ['tools/build.cjs', '--check']);
for (const file of ['game.bundle.js', 'learning-gate.js', 'pwa.js', 'sw.js', 'vendor/phaser.min.js']) new vm.Script(fs.readFileSync(file, 'utf8'), {filename: file});
const html = fs.readFileSync('index.html','utf8');
const css = fs.readFileSync('style.css','utf8');
const controlsRule = css.match(/#touch-controls\s*\{([^}]+)\}/)[1];
assert(/bottom:\s*64px;/.test(controlsRule), 'Controls need a 64px fallback above system gestures');
assert(/bottom:\s*calc\(64px \+ env\(safe-area-inset-bottom, 0px\)\);/.test(controlsRule), 'Safe-area inset must add to the 64px margin');
assert(!html.includes('cdn.jsdelivr.net'));
assert(fs.readFileSync('family-v2/family.js','utf8').includes('https://cmlozanos.github.io/games/'));
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
assert(sw.FILES.includes('./' + html.match(/href="(style\.css\?v=[^"]+)"/)[1]), 'Precache must contain the current stylesheet version');
assert(sw.CACHE.startsWith('banana-party-'));
console.log('PASS syntax, generated bundle, local assets, gate bootstrap, bounded background and PWA files');

const kitFiles = ['family.css','family.js','playwrite-es.ttf','OFL.txt'];
const cached = sw.FILES;
for (const file of kitFiles) assert(cached.includes('./family-v2/'+file+(file.endsWith('.css')||file.endsWith('.js')?'?v=2.0.0':'')), 'Exact kit precache '+file);
assert(html.includes('defer src="family-v2/family.js?v=2.0.0" data-game="banana-party"'));
new vm.Script(fs.readFileSync('family-v2/family.js','utf8'));
console.log('PASS V2 classic kit, slug and all four exact offline assets');

// Phaser passes GameObjects to process callbacks: ascend through, land while falling.
const collisionMethod = game.slice(game.indexOf('    processPlatformCollision('), game.indexOf('    checkPlayerOnPlatforms('));
const collision = vm.runInNewContext('({' + collisionMethod + '})').processPlatformCollision;
const player = {body:{velocity:{y:-100}}};player.body.gameObject=player;
assert.equal(collision.call({player:{sprite:player}},player,{body:{}}),false,'ascending player passes through platform');
player.body.velocity.y=100;
assert.equal(collision.call({player:{sprite:player}},player,{body:{}}),true,'falling player can land');
console.log('PASS one-way platform callback with actual Phaser argument shape');

// A tap can begin and end between render frames. Jump must survive until consumed.
const handlers = {}, button = {dataset:{control:'jump'},classList:{add(){},remove(){}},setPointerCapture(){},addEventListener(type,fn){handlers[type]=fn;}};
const controls = fs.readFileSync('src/controls.js','utf8').replace(/^export /gm,'');
const inputScope = {Map,window:{addEventListener(){}},document:{querySelectorAll(){return [button];},addEventListener(){}}};
vm.createContext(inputScope);vm.runInContext(controls+';this.input=touchInput;',inputScope);
handlers.pointerdown({pointerId:1,preventDefault(){}});handlers.pointerup({pointerId:1});
assert.equal(inputScope.input.jump,true,'quick released tap is queued');
vm.runInContext('clearControls();',inputScope);assert.equal(inputScope.input.jump,false,'pauses clear queued input');
console.log('PASS quick jump tap queue and pause input reset');
