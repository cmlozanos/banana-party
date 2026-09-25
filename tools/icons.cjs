// Generate dependency-free PNG launcher icons (original banana silhouette).
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
function chunk(type, data) {
    const name = Buffer.from(type), body = Buffer.concat([name, data]);
    let crc = 0xffffffff;
    for (const byte of body) { crc ^= byte; for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0); }
    const size = Buffer.alloc(4), sum = Buffer.alloc(4); size.writeUInt32BE(data.length); sum.writeUInt32BE((crc ^ 0xffffffff) >>> 0);
    return Buffer.concat([size, body, sum]);
}
const root = path.resolve(__dirname, '..', 'icons'); fs.mkdirSync(root, {recursive: true});
for (const size of [192, 512]) {
    const raw = Buffer.alloc((size * 4 + 1) * size);
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
        const nx = x / size, ny = y / size;
        const outer = Math.pow((nx - .51) / .31, 2) + Math.pow((ny - .48) / .32, 2) < 1;
        const inner = Math.pow((nx - .61) / .3, 2) + Math.pow((ny - .35) / .30, 2) < 1;
        const banana = outer && !inner;
        const stem = nx > .215 && nx < .27 && ny > .2 && ny < .34;
        const c = stem ? [165,105,9] : banana ? [255,216,61] : [23,61,48];
        const at = y * (size * 4 + 1) + 1 + x * 4;
        raw[at] = c[0]; raw[at+1] = c[1]; raw[at+2] = c[2]; raw[at+3] = 255;
    }
    const header = Buffer.alloc(13); header.writeUInt32BE(size,0); header.writeUInt32BE(size,4); header[8] = 8; header[9] = 6;
    fs.writeFileSync(path.join(root, 'icon-' + size + '.png'), Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk('IHDR',header), chunk('IDAT',zlib.deflateSync(raw)), chunk('IEND',Buffer.alloc(0))]));
}
