const { chromium } = require('playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { checkTouchUI } = require('./touch-check.cjs');
const root = path.resolve(__dirname, '..');
async function startLevel(page) {
    await page.waitForFunction(() => __capturedGame.scene.isActive('LevelSelectMenu'));
    const scene = await page.evaluate(() => { const z=__capturedGame.scene.getScene('LevelSelectMenu').levelButtons[0].zone; return {x:z.x,y:z.y}; });
    const canvasBox = await page.locator('canvas').first().boundingBox();
    await page.touchscreen.tap(canvasBox.x+scene.x*canvasBox.width/800,canvasBox.y+scene.y*canvasBox.height/600);
    await page.waitForFunction(() => __capturedGame.scene.isActive('BananaPartyGame'));
    await page.locator('#touch-controls').waitFor({state:'visible'});
}
async function checkControlsLayout(page, stage) {
    const viewport = page.viewportSize(), size = viewport.height <= 440 ? 54 : 64;
    const label = viewport.width+'x'+viewport.height+' '+stage;
    const controls = page.locator('#touch-controls button');
    assert.equal(await controls.count(), 3, label+' retains all controls');
    const boxes = [];
    for (const control of await controls.all()) {
        assert(await control.isVisible(), label+' control visible');
        const box = await control.boundingBox();
        assert.equal(box.width, size, label+' control width unchanged');
        assert.equal(box.height, size, label+' control height unchanged');
        assert(box.x >= 0 && box.y >= 0 && box.x+box.width <= viewport.width && box.y+box.height <= viewport.height, label+' control inside viewport');
        const bottomGap = viewport.height-box.y-box.height;
        assert(bottomGap >= 64, label+' bottom clearance must be at least 64px, got '+bottomGap+'px');
        boxes.push(box);
    }
    boxes.push(await page.locator('#home-link').boundingBox());
    for (let i=0; i<boxes.length; i++) for (let j=i+1; j<boxes.length; j++) {
        const a=boxes[i], b=boxes[j];
        assert(a.x+a.width <= b.x || b.x+b.width <= a.x || a.y+a.height <= b.y || b.y+b.height <= a.y, label+' controls and home link must not overlap');
    }
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.documentElement.scrollHeight <= innerHeight), label+' no document overflow');
}
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
        for (const viewport of [{width:1280,height:800},{width:800,height:1280},{width:360,height:740},{width:740,height:360}]) {
            const context = await browser.newContext({viewport,hasTouch:true});
            const page = await context.newPage(), errors = [];
            page.on('pageerror', error => errors.push(error.message));
            await page.addInitScript(() => { window.__testOffset=0; const now=Date.now; Date.now=()=>now()+window.__testOffset; const Original=Phaser=>Phaser; window.__capturedGame=null; Object.defineProperty(window,'Phaser',{configurable:true,set(value){const Game=value.Game;value.Game=class extends Game{constructor(config){super(config);window.__capturedGame=this;}};Object.defineProperty(window,'Phaser',{value,writable:true,configurable:true});}}); });
            await page.goto('http://127.0.0.1:' + server.address().port + '/');
            await page.locator('#learning-gate').waitFor();
            assert(await page.evaluate(() => __capturedGame.isPaused));
            await solve(page);
            await checkTouchUI(page, '#home-link');
            await startLevel(page);
            await page.waitForTimeout(700);
            await checkControlsLayout(page, 'entry');
            if (process.env.SCREENSHOT_DIR) { fs.mkdirSync(process.env.SCREENSHOT_DIR,{recursive:true}); await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'banana-'+viewport.width+'.png')}); }
            const before = await page.evaluate(() => __capturedGame.scene.getScene('BananaPartyGame').player.sprite.x);
            const right=await page.locator('[data-control="right"]').boundingBox();
            const touch = await context.newCDPSession(page);
            await touch.send('Input.dispatchTouchEvent', {type:'touchStart',touchPoints:[{x:right.x+20,y:right.y+20,id:1}]});
            await page.waitForTimeout(800);
            assert(await page.locator('[data-control="right"]').evaluate(node=>node.classList.contains('pressed')));
            const heldVelocity=await page.evaluate(()=>__capturedGame.scene.getScene('BananaPartyGame').player.sprite.body.velocity.x);
            await touch.send('Input.dispatchTouchEvent', {type:'touchEnd',touchPoints:[]});
            assert.equal(await page.locator('[data-control="right"]').evaluate(node=>node.classList.contains('pressed')),false);
            await touch.detach();
            assert(await page.evaluate(old => __capturedGame.scene.getScene('BananaPartyGame').player.sprite.x>old,before));
            const releasedX=await page.evaluate(()=>__capturedGame.scene.getScene('BananaPartyGame').player.sprite.x);
            await page.waitForTimeout(160);
            assert(await page.evaluate(held=>Math.abs(__capturedGame.scene.getScene('BananaPartyGame').player.sprite.body.velocity.x)<Math.abs(held)/2,heldVelocity),'touch release restores existing friction instead of holding movement');
            await page.keyboard.down('ArrowLeft');await page.waitForTimeout(120);await page.keyboard.up('ArrowLeft');
            assert(await page.evaluate(old=>__capturedGame.scene.getScene('BananaPartyGame').player.sprite.x<old,releasedX),'keyboard still moves');
            await page.setViewportSize({width:viewport.height,height:viewport.width});
            await checkControlsLayout(page, 'rotated during play');
            assert(await page.evaluate(() => __capturedGame.scene.isActive('BananaPartyGame')), 'rotation keeps the current game active');
            await page.setViewportSize(viewport);
            await checkControlsLayout(page, 'rotated back');
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
            await startLevel(page);
            await checkControlsLayout(page, 'offline reload');
            assert.deepEqual(errors,[]);
            await context.close();
            console.log('PASS',viewport.width+'x'+viewport.height, 'entry/layout/rotation/touch/keyboard/10min/pause/resume/offline');
        }
        console.log('Browser',await browser.version());
    } finally {await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exit(1);});
