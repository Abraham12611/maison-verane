// usage: node scripts/shots.mjs <width> <height> [url]
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const [w, h, url = 'http://127.0.0.1:5180/'] = [Number(process.argv[2] ?? 1440), Number(process.argv[3] ?? 900), process.argv[4]];
fs.mkdirSync('tmp/shots', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: w, height: h } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(1200);

const sections = await page.$$eval('main > section, footer', (els) =>
  els.map((el, i) => ({ i, id: el.id || el.className.split(' ')[1] || el.className, h: Math.round(el.getBoundingClientRect().height) })),
);
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log(`viewport ${w}x${h}  overflowX=${overflow}`);
for (const s of sections) console.log(String(s.i).padStart(2), s.id.padEnd(12), s.h, (s.h / h).toFixed(2) + 'x');

const handles = await page.$$('main > section, footer');
let n = 0;
for (const el of handles) {
  await el.scrollIntoViewIfNeeded();
  await el.evaluate((e) => e.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(700);
  await page.screenshot({ path: `tmp/shots/s${String(n).padStart(2, '0')}-${w}.png` });
  n++;
}
console.log('errors:', errors.length ? errors.slice(0, 5) : 'none');
await browser.close();
