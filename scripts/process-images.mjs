// Converts generated photography to WebP. Prefers the SeedVR2 2x upscale (`*-2x.jpg`) when present.
import sharp from 'sharp';
import fs from 'node:fs';

fs.mkdirSync('public/img', { recursive: true });
const jobs = [
  ['hero', 2176, 76],
  ['hotel', 2176, 74],
  ['craft', 2048, 76],
  ['materials', 2048, 76],
  ['journey', 1536, 76],
  ['p-weekender', 768, 82],
  ['p-tote', 768, 82],
  ['p-satchel', 768, 82],
  ['p-trunk', 768, 82],
];
for (const [name, width, quality] of jobs) {
  const src = fs.existsSync(`raw/${name}-2x.jpg`) ? `raw/${name}-2x.jpg` : `raw/${name}.jpg`;
  const out = `public/img/${name}.webp`;
  const info = await sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(out);
  console.log(name.padEnd(12), src.includes('2x') ? '2x' : '1x', `${info.width}x${info.height}`, `${(info.size / 1024).toFixed(0)}kB`);
}
