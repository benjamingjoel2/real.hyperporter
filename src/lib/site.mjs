/**
 * Deployment origin and index policy.
 *
 * This repository is a fork. The upstream default baked `https://hyperporter.com`
 * into every canonical, OG URL and sitemap entry — correct there, actively
 * harmful here, because it tells Google that every page of this site is a
 * duplicate of the other one. So there is deliberately no hardcoded domain
 * below: the origin comes from the environment, and an unset environment
 * fails loudly to localhost rather than quietly to somebody else's domain.
 *
 * Resolution order:
 *   1. SITE_URL              — explicit override, wins everywhere.
 *   2. Vercel production     — the project's production domain.
 *   3. Vercel preview        — this deployment's own unique URL, so a preview
 *                              canonicalises to itself and never to production.
 *   4. anything else         — localhost, i.e. obviously wrong on inspection.
 */
function resolveSite() {
  const explicit = process.env.SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, '');

  if (process.env.VERCEL) {
    // Set by Vercel on every build. PRODUCTION_URL is the project's assigned
    // production domain; VERCEL_URL is unique per deployment.
    const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
    if (process.env.VERCEL_ENV === 'production' && prod) return `https://${prod}`;

    const self = process.env.VERCEL_URL;
    if (self) return `https://${self}`;
  }

  return 'http://localhost:4321';
}

export const SITE = resolveSite();

/**
 * Only a production deployment may be indexed. Vercel gives every preview and
 * every branch its own public URL; left crawlable those become dozens of
 * complete copies of the site, competing with production for its own terms.
 * Preview builds therefore emit `noindex` on every page and a blanket
 * `Disallow: /` in robots.txt.
 */
export const IS_PRODUCTION =
  process.env.VERCEL_ENV === 'production' || process.env.SITE_INDEXABLE === 'true';
