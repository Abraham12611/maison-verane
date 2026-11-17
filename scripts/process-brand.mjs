// Cleans Recraft SVGs: drops C2PA metadata and the full-bleed background rect,
// then tightens the viewBox to the artwork so logos align without padding.
import sharp from 'sharp';
import fs from 'node:fs';

fs.mkdirSync('public/brand', { recursive: true });
const files = ['logo-mark', 'logo-wordmark', 'logo-lockup', 'blueprint', 'icons'];

for (const name of files) {
  let svg = fs.readFileSync(`raw/${name}.svg`, 'utf8');
  svg = svg.replace(/<metadata>[\s\S]*?<\/metadata>/, '');
  // first path is the background rectangle
  svg = svg.replace(/<path[^>]*fill="rgb\(18,12,10\)"[^>]*d="M 0 0 L \d+ 0 L \d+ \d+ L 0 \d+ L 0 0 z"\s*\/>/, '');
  const vb = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
  const [vw, vh] = [Number(vb[1]), Number(vb[2])];
  // Render with the dark counters visible against a light backdrop to find the gold bbox.
  const gold = svg.replace(/fill="rgb\(18,12,10\)"/g, 'fill="none"');
  const png = await sharp(Buffer.from(gold.replace(/ width="\d+" height="\d+"/, ` width="${vw}" height="${vh}"`)))
    .png()
    .toBuffer();
  const { info } = await sharp(png).trim({ threshold: 10 }).toBuffer({ resolveWithObject: true });
  const left = -info.trimOffsetLeft;
  const top = -info.trimOffsetTop;
  const pad = Math.round(Math.max(info.width, info.height) * 0.02);
  const x = left - pad, y = top - pad, w = info.width + pad * 2, h = info.height + pad * 2;
  svg = svg
    .replace(/viewBox="[^"]+"/, `viewBox="${x} ${y} ${w} ${h}"`)
    .replace(/ width="\d+" height="\d+"/, '')
    .replace(/ preserveAspectRatio="none"/, ' preserveAspectRatio="xMidYMid meet"')
    .replace(/ style="display: block;"/, '')
    .replace(/ xmlns:c2pa="[^"]+"/, '');
  fs.writeFileSync(`public/brand/${name}.svg`, svg);
  if (name === 'icons') {
    // Light-background variant: gold becomes deep brass, dark counters become the cream page colour.
    fs.writeFileSync(
      'public/brand/icons-light.svg',
      svg.replace(/rgb\(201,164,92\)/g, 'rgb(122,90,42)').replace(/rgb\(18,12,10\)/g, 'rgb(239,230,214)'),
    );
  }
  console.log(name, { x, y, w, h }, `${(svg.length / 1024).toFixed(0)}kB`);
}
