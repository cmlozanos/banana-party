const { chromium } = require('playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
async function solve(page) {
    const prompt = page.locator('#gate-prompt');
    if (await prompt.isVisible()) {
        const parts = (await prompt.textContent()).match(/(\d)\s*([+−-])\s*(\d)/);
        const answer = parts[2] === '+' ? +parts[1] + +parts[3] : +parts[1] - +parts[3];
        await page.locator('[data-gate-key="' + answer + '"]').click();
    } else {
        const canvas = page.locator('#gate-trace'), box = await canvas.boundingBox();
        const strokes = await canvas.evaluate(node => LearningGate.Core.glyphs[node.dataset.letter]);
        for (const stroke of strokes) {
            await page.mouse.move(box.x + stroke[0][0]*box.width/100, box.y + stroke[0][1]*box.height/100); await page.mouse.down();
            for (const p of stroke.slice(1)) await page.mouse.move(box.x+p[0]*box.width/100,box.y+p[1]*box.height/100,{steps:3});
            await page.mouse.up();
        }
    }
    await page.waitForFunction(() => !document.getElementById('learning-gate'));
}
(async () => {
    const server = http.createServer((req, res) => {
        let file = decodeURIComponent(req.url.split('?')[0]); if (file.endsWith('/')) file += 'index.html';
        const target = path.join(root, file);
        if (!target.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
        fs.readFile(target, (error, data) => { if (error) { res.writeHead(404); return res.end(); } res.setHeader('Content-Type', ({'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.webmanifest':'application/manifest+json','.png':'image/png'})[path.extname(target)] || 'application/octet-stream'); res.end(data); });
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const browser = await chromium.launch({headless:true, executablePath:process.env.CHROME95_PATH || undefined});
    try {
        for (const viewport of [{width:1280,height:800},{width:360,height:740}]) {
            const context = await browser.newContext({viewport,hasTouch:true});
            const page = await context.newPage(), errors = [];
            page.on('pageerror', error => errors.push(error.message));
            await page.addInitScript(() => { window.__testOffset=0; const now=Date.now; Date.now=()=>now()+window.__testOffset; const Original=Phaser=>Phaser; window.__capturedGame=null; Object.defineProperty(window,'Phaser',{configurable:true,set(value){const Game=value.Game;value.Game=class extends Game{constructor(config){super(config);window.__capturedGame=this;}};Object.defineProperty(window,'Phaser',{value,writable:true,configurable:true});}}); });
            await page.goto('http://127.0.0.1:' + server.address().port + '/');
            await page.locator('#learning-gate').waitFor();
            assert(await page.evaluate(() => __capturedGame.isPaused));
            await solve(page);
            await page.waitForFunction(() => __capturedGame.scene.isActive('LevelSelectMenu'));
            const scene = await page.evaluate(() => { const g=__capturedGame; const z=g.scene.getScene('LevelSelectMenu').levelButtons[0].zone; return {x:z.x,y:z.y}; });
            const canvasBox=await page.locator('canvas').first().boundingBox();
            await page.touchscreen.tap(canvasBox.x+scene.x*canvasBox.width/800,canvasBox.y+scene.y*canvasBox.height/600);
            await page.waitForFunction(() => __capturedGame.scene.isActive('BananaPartyGame'));
            await page.waitForTimeout(700);
            if (process.env.SCREENSHOT_DIR) { fs.mkdirSync(process.env.SCREENSHOT_DIR,{recursive:true}); await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'banana-'+viewport.width+'.png')}); }
            const before = await page.evaluate(() => __capturedGame.scene.getScene('BananaPartyGame').player.sprite.x);
            const right=await page.locator('[data-control="right"]').boundingBox();
            await page.mouse.move(right.x+20,right.y+20); await page.mouse.down(); await page.waitForTimeout(180); await page.mouse.up();
            assert(await page.evaluate(old => __capturedGame.scene.getScene('BananaPartyGame').player.sprite.x>old,before));
            await page.evaluate(() => {window.__testOffset+=600001;});
            await page.locator('#learning-gate').waitFor();
            const locked=await page.evaluate(() => {const s=__capturedGame.scene.getScene('BananaPartyGame').player.sprite;return [s.x,s.y];});
            await page.waitForTimeout(250);
            assert.deepEqual(await page.evaluate(() => {const s=__capturedGame.scene.getScene('BananaPartyGame').player.sprite;return [s.x,s.y];}),locked);
            await solve(page);
            assert(!await page.evaluate(() => __capturedGame.isPaused));
            await page.evaluate(async () => {await navigator.serviceWorker.ready;});
            await page.waitForFunction(() => !!navigator.serviceWorker.controller);
            await context.setOffline(true); await page.reload(); await page.locator('#learning-gate').waitFor(); await solve(page);
            assert.equal(await page.locator('#home-link').getAttribute('href'),'https://cmlozanos.github.io/games/');
            assert.deepEqual(errors,[]);
            await context.close();
            console.log('PASS',viewport.width+'x'+viewport.height, 'entry/touch/10min/pause/resume/offline');
        }
        console.log('Browser',await browser.version());
    } finally {await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exit(1);});
