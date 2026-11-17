// usage: node scripts/check.mjs <url>
import { chromium } from '@playwright/test';
const url = process.argv[2] ?? 'http://127.0.0.1:4180/';
const browser = await chromium.launch({ channel: 'chrome', args: ['--autoplay-policy=no-user-gesture-required'] });
const results = [];
const ok = (name, pass, extra = '') => results.push(`${pass ? 'PASS' : 'FAIL'}  ${name} ${extra}`);

for (const [w, h] of [[1440, 900], [820, 1180], [390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  ok(`${w}px no horizontal overflow`, over <= 0, `(${over})`);
  const broken = await page.evaluate(async () => {
    const imgs = [...document.images];
    imgs.forEach((i) => (i.loading = 'eager'));
    await Promise.all(imgs.map((i) => i.decode().catch(() => null)));
    return imgs.filter((i) => !i.naturalWidth).map((i) => i.src);
  });
  ok(`${w}px every image loads`, broken.length === 0, broken.join(','));

  if (w === 1440) {
    await page.locator('#film').scrollIntoViewIfNeeded();
    const video = page.locator('.ecrin video');
    await page.getByRole('button', { name: /play/i }).first().click();
    await page.waitForFunction(() => { const v = document.querySelector('.ecrin video'); return v && v.currentTime > 1.2 && !v.paused; }, null, { timeout: 25000 }).then(
      () => ok('Mux film plays', true),
      () => ok('Mux film plays', false),
    );
    const vol = await page.evaluate(() => document.querySelector('.ecrin video').volume);
    ok('volume control present', (await page.locator('.ecrin-volume').count()) > 0, `(vol ${vol})`);
    await page.getByRole('button', { name: 'Settings' }).click();
    const rows = await page.locator('.ecrin-menu-row .row-label').allTextContents();
    ok('settings: speed only, no skin picker', rows.length === 1 && /speed/i.test(rows[0]), JSON.stringify(rows));
    await page.keyboard.press('Escape');
    const t0 = await video.evaluate((v) => v.currentTime);
    await page.keyboard.press('Escape');
    ok('plaque reads VERANE', (await page.locator('.orn-plaque b').first().textContent()) === 'VERANE');
    void t0;
    await page.locator('.card .add').first().click({ force: true });
    ok('add to bag updates counter', (await page.locator('.bag span').textContent()) === '1');
  }
  if (w === 390) {
    await page.getByRole('button', { name: 'Open menu' }).click();
    ok('mobile menu opens', await page.locator('#mobile-nav').isVisible());
  }
  ok(`${w}px no page errors`, errs.length === 0, errs.join(' | '));
  await page.close();
}
console.log(results.join('\n'));
await browser.close();
process.exit(results.some((r) => r.startsWith('FAIL')) ? 1 : 0);
