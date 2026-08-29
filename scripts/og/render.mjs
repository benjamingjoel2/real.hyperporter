/**
 * Renders public/og.png — the sitewide Open Graph / Twitter card — at 1200x630.
 *
 * The card is composed at render time rather than committed as one large
 * self-contained file: the world map is lifted from the built homepage, so the
 * card's coverage can never drift from the site's, and the two fonts go in as
 * data URIs so the output does not depend on Google Fonts being reachable.
 *
 * The PNG is committed, so this only needs running when the card changes.
 * Keeping it out of `npm run build` avoids making a headless browser a
 * dependency of every deploy for an asset that changes maybe twice a year.
 *
 * Run `npm run build` first (the map is read from dist/), then:
 *
 *   npx --yes playwright@latest install chromium
 *   npx --yes -p playwright-core node scripts/og/render.mjs
 *
 * Set CHROMIUM to point at an existing binary instead of installing one.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const out = path.join(root, 'public/og.png');
const built = path.join(root, 'dist/index.html');

if (!fs.existsSync(built)) {
  console.error('no dist/index.html — run `npm run build` first (the map comes from it)');
  process.exit(1);
}

// The hero map, straight from the built homepage. Interactive attributes come
// off: on a flat image the links and tooltips are dead weight.
const home = fs.readFileSync(built, 'utf8');
const heroMap = home.match(/<div class="hx-shero-map"[^>]*>([\s\S]*?)<div class="hx hx-shero-in"/);
if (!heroMap) {
  console.error('could not find the hero map in dist/index.html — has the homepage markup changed?');
  process.exit(1);
}
const map = heroMap[1]
  .match(/<svg[\s\S]*<\/svg>/)[0]
  .replace(/<\/?a\b[^>]*>/g, '')
  .replace(/\s(?:data-name|data-label|aria-label|href)="[^"]*"/g, '');

const dataUri = (file) =>
  `data:font/woff2;base64,${fs.readFileSync(file).toString('base64')}`;

// Substitution that fails loudly. A silent miss here still produces a
// plausible-looking PNG — fallback fonts, no map — which is exactly the kind
// of thing that ships unnoticed. Splitting on the token also sidesteps
// String.replace treating `$` sequences in the replacement as special.
const fill = (template, name, value) => {
  const parts = template.split(`{{${name}}}`);
  if (parts.length !== 2) {
    console.error(
      `card.html: expected exactly one {{${name}}} placeholder, found ${parts.length - 1}`
    );
    process.exit(1);
  }
  return parts[0] + value + parts[1];
};

let html = fs.readFileSync(path.join(here, 'card.html'), 'utf8');
html = fill(html, 'NEWSREADER', dataUri(path.join(here, 'newsreader-400.woff2')));
html = fill(html, 'HYPERLOCAL', dataUri(path.join(root, 'public/fonts/hyperlocal-rom-regular.woff2')));
html = fill(html, 'MAP', map);

let chromium;
try {
  ({ chromium } = await import('playwright-core'));
} catch {
  console.error('playwright-core not found — see the header of this file.');
  process.exit(1);
}

const browser = await chromium.launch(
  process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}
);
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
// A file:// base is needed for nothing here — the page is fully self-contained
// once the placeholders are filled — but set one anyway so relative URLs, if
// any are ever added, resolve beside the template.
await page.setContent(html, { baseURL: pathToFileURL(here + '/').href, waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: out, type: 'png' });
await browser.close();

const kb = (fs.statSync(out).size / 1024).toFixed(0);
console.log(`wrote ${path.relative(process.cwd(), out)} — 1200x630, ${kb}KB`);
