/**
 * Post-build SEO invariants.
 *
 * Run against dist/ after `astro build`. These are the failures that are
 * invisible in a browser and expensive to notice later — a page that is both
 * noindex and listed in the sitemap, a canonical pointing at the wrong origin,
 * a page with no description. Each one silently costs indexing.
 *
 * Usage: node scripts/check-seo.mjs [dist]
 */
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(process.argv[2] ?? 'dist');
const errors = [];
const fail = (msg) => errors.push(msg);

if (!fs.existsSync(dist)) {
  console.error(`no build at ${dist} — run \`npm run build\` first`);
  process.exit(1);
}

const htmlFiles = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) htmlFiles.push(full);
  }
})(dist);

const routeOf = (file) => {
  const rel = path.relative(dist, file).replace(/\\/g, '/');
  const noIndexHtml = rel.replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '');
  return '/' + noIndexHtml;
};

const read = (f) => fs.readFileSync(f, 'utf8');
const attr = (html, re) => (html.match(re) ?? [])[1];

const pages = new Map();
for (const file of htmlFiles) {
  const html = read(file);
  pages.set(routeOf(file), {
    file,
    noindex: /<meta\s+name="robots"\s+content="noindex/i.test(html),
    canonical: attr(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i),
    title: attr(html, /<title>([^<]*)<\/title>/i),
    description: attr(html, /<meta\s+name="description"\s+content="([^"]*)"/i),
    ogUrl: attr(html, /<meta\s+property="og:url"\s+content="([^"]+)"/i),
  });
}

// --- every page carries the basics ---------------------------------------
// A title is worth having even on a noindex page (it names the browser tab).
// A description and canonical only do work for a page that can be indexed, so
// they are not required of one that cannot — the /preview/* design studies
// carry neither by design.
for (const [route, p] of pages) {
  if (!p.title) fail(`${route}: no <title>`);
  if (p.noindex) continue;
  if (!p.description) fail(`${route}: no meta description`);
  if (!p.canonical) fail(`${route}: no canonical`);
}

// --- canonical origin is consistent, and is not the upstream site ---------
const origins = new Set(
  [...pages.values()].filter((p) => p.canonical).map((p) => new URL(p.canonical).origin)
);
if (origins.size > 1) fail(`canonicals span multiple origins: ${[...origins].join(', ')}`);

// This repo is a fork. A canonical pointing at the upstream domain tells
// Google every page here is a duplicate of that site — see src/lib/site.mjs.
for (const origin of origins) {
  if (/(^|\.)hyperporter\.com$/.test(new URL(origin).hostname)) {
    fail(
      `canonical origin is ${origin} — the upstream site. Set SITE_URL, or let ` +
        `Vercel supply the origin. Deploying this would deindex the whole site.`
    );
  }
}

// --- canonical points at the page it is on -------------------------------
for (const [route, p] of pages) {
  if (!p.canonical) continue;
  const got = new URL(p.canonical).pathname.replace(/(.)\/$/, '$1');
  const want = route.replace(/(.)\/$/, '$1');
  if (got !== want) fail(`${route}: canonical points at ${got}`);
  if (p.ogUrl && p.ogUrl !== p.canonical) fail(`${route}: og:url disagrees with canonical`);
}

// --- sitemap and noindex must not contradict each other -------------------
const sitemapFiles = fs.readdirSync(dist).filter((f) => /^sitemap-\d+\.xml$/.test(f));
const listed = [];
for (const f of sitemapFiles) {
  for (const m of read(path.join(dist, f)).matchAll(/<loc>([^<]+)<\/loc>/g)) listed.push(m[1]);
}

if (sitemapFiles.length) {
  for (const loc of listed) {
    const route = new URL(loc).pathname.replace(/(.)\/$/, '$1') || '/';
    const page = pages.get(route) ?? pages.get(route + '/');
    if (!page) {
      fail(`sitemap lists ${route}, which the build did not produce`);
      continue;
    }
    if (page.noindex) fail(`sitemap lists ${route}, but the page is noindex`);
  }

  const robots = path.join(dist, 'robots.txt');
  if (fs.existsSync(robots) && /^\s*Disallow:\s*\/\s*$/m.test(read(robots))) {
    fail('robots.txt disallows everything, yet a sitemap was emitted');
  }
}

// --- report ---------------------------------------------------------------
const indexable = [...pages.values()].filter((p) => !p.noindex).length;
if (errors.length) {
  console.error(`\nSEO check failed — ${errors.length} problem(s):\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error('');
  process.exit(1);
}
console.log(
  `SEO check passed — ${pages.size} pages, ${indexable} indexable, ` +
    `${listed.length} in sitemap, origin ${[...origins][0] ?? 'n/a'}`
);
