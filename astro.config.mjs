import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import matter from 'gray-matter';
import { SITE, IS_PRODUCTION } from './src/lib/site.mjs';

const destinationsDir = new URL('./src/content/destinations/', import.meta.url);

// Destinations are noindex-by-default (see src/content/config.ts). This reads
// each destination's frontmatter directly — content collections aren't
// queryable from astro.config.mjs — to build the set of slugs that opted in
// via `index: true`, so the sitemap only ever lists those.
function indexableDestinationSlugs() {
  const slugs = new Set();
  if (!fs.existsSync(destinationsDir)) return slugs;
  for (const file of fs.readdirSync(destinationsDir)) {
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
    const { data } = matter(fs.readFileSync(new URL(file, destinationsDir), 'utf8'));
    if (data.index === true) {
      slugs.add(data.slug ?? file.replace(/\.mdx?$/, ''));
    }
  }
  return slugs;
}

const indexableDestinations = indexableDestinationSlugs();

// Pages that render a noindex robots tag and so must not be listed in the
// sitemap either: About until the "Name pending" bios are real, Terms and
// Privacy until counsel has reviewed the drafts.
// /preview/* is a throwaway design study, not a real page.
const noindexPaths = new Set(['/about', '/terms', '/privacy', '/404', '/preview/oh', '/preview/brandigo']);

// Sitemap paths are compared against `noindexPaths` with any trailing slash
// removed, so that set stays correct whichever trailingSlash policy is in
// force. Getting this wrong silently publishes noindex pages into the sitemap
// — the exact contradiction, "do not index this" alongside "here, index this",
// that makes Search Console flag a property. scripts/check-seo.mjs catches it.
const normalise = (pathname) => pathname.replace(/(.)\/$/, '$1');

export default defineConfig({
  // Canonicals, OG URLs, the sitemap and robots.txt all derive from this, so
  // it must match the origin actually being served. Resolved from the
  // environment rather than hardcoded — see src/lib/site.mjs for why that
  // matters in a fork.
  site: SITE,
  // Every internal href in the codebase is written without a trailing slash
  // ("/about", "/destinations/japan"), so canonicals, OG URLs and the sitemap
  // are emitted the same way. The alternative — canonicalising to "/about/" —
  // would 308-redirect all ~160 internal links on every navigation. Vercel is
  // configured with "trailingSlash": false to match, and redirects the slashed
  // form to this one so only a single URL per page is ever crawlable.
  trailingSlash: 'never',
  build: { format: 'directory' },
  integrations: [
    mdx(),
    // No sitemap on preview deployments. Those are noindex and robots-blocked
    // anyway (see src/lib/site.mjs), and shipping one would only advertise a
    // second full copy of the site under a throwaway origin.
    ...(IS_PRODUCTION
      ? [
          sitemap({
            filter: (page) => {
              const pathname = normalise(new URL(page).pathname);
              if (noindexPaths.has(pathname)) return false;
              const match = pathname.match(/^\/destinations\/([^/]+)$/);
              if (!match) return true;
              return indexableDestinations.has(match[1]);
            },
          }),
        ]
      : []),
  ],
});
