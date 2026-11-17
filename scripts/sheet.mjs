import sharp from 'sharp';
import fs from 'node:fs';
const names = fs.readdirSync('raw').filter((n) => /\.(jpg|svg)$/.test(n));
const W = 480;
const tiles = [];
for (const n of names) {
  const input = n.endsWith('.svg') ? await sharp('raw/' + n, { density: 96 }).flatten({ background: '#222' }).png().toBuffer() : fs.readFileSync('raw/' + n);
  const m = await sharp(input).metadata();
  console.log(n, m.width, m.height);
  const t = await sharp(input).resize(W, 300, { fit: 'contain', background: '#333' }).png().toBuffer();
  tiles.push({ input: t });
}
const cols = 4, rows = Math.ceil(tiles.length / cols);
await sharp({ create: { width: W * cols, height: 300 * rows, channels: 3, background: '#111' } })
  .composite(tiles.map((t, i) => ({ ...t, left: (i % cols) * W, top: Math.floor(i / cols) * 300 })))
  .png().toFile('tmp/sheet.png');
console.log(names.join(', '));
