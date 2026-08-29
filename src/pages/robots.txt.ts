import type { APIRoute } from 'astro';
import { IS_PRODUCTION } from '../lib/site.mjs';

/**
 * robots.txt, generated so the Sitemap line always carries the real deployed
 * origin rather than a hardcoded domain (see src/lib/site.mjs).
 *
 * On production, deliberately no Disallow rules for the noindex pages (all
 * 137 destinations, /about, /terms, /privacy): a crawler has to fetch a page
 * to see its robots meta tag, so disallowing them here would prevent the
 * noindex from ever being read. Crawl-blocking and index-blocking are
 * different mechanisms and combining them is counterproductive. The noindex
 * tag plus sitemap exclusion is the correct pairing.
 *
 * Preview deployments are the one case where a blanket disallow IS right:
 * there is nothing on them we ever want read, indexed or not.
 */
export const GET: APIRoute = ({ site }) => {
  // Preview and branch deployments get their own public URL on Vercel. They
  // are noindex at the page level too, but a blanket disallow keeps crawlers
  // off them entirely rather than relying on the meta tag being read.
  const body = IS_PRODUCTION
    ? `User-agent: *
Allow: /

Sitemap: ${new URL('sitemap-index.xml', site).toString()}
`
    : `User-agent: *
Disallow: /
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
