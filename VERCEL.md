# Deploying this site on Vercel

This repository is a **fork** of the original Hyperporter site. It is its own
project with its own design, deployed to its own domain on Vercel. The
Docker + nginx stack described in `DEPLOY.md` belongs to the original
deployment and is not used here — see [Inherited Docker stack](#inherited-docker-stack).

The site is fully static. Nothing runs server-side at request time, so no
Astro adapter is needed.

---

## The one setting that matters

Canonical tags, OG URLs, `sitemap.xml` and the `Sitemap:` line in
`robots.txt` are **baked in at build time** from the deployment origin. Get
it wrong and every page of this site tells Google it is a duplicate of the
other one, and none of it gets indexed.

There is deliberately **no hardcoded domain** anywhere in the build. The
origin resolves, in order (`src/lib/site.mjs`):

| # | Source | Used when |
|---|---|---|
| 1 | `SITE_URL` | Set explicitly. Wins everywhere. |
| 2 | `https://$VERCEL_PROJECT_PRODUCTION_URL` | Vercel, `VERCEL_ENV=production`. |
| 3 | `https://$VERCEL_URL` | Vercel preview — each preview canonicalises to itself. |
| 4 | `http://localhost:4321` | Anything else. Obviously wrong on inspection, which is the point. |

Vercel sets 2 and 3 automatically. **On a normal Vercel setup you do not
need to set `SITE_URL` at all** — attach the custom domain and it follows.
Set it only to override, e.g. a staging origin.

A build whose canonicals point at `hyperporter.com` **fails**. That check is
in `scripts/check-seo.mjs` and runs as part of `npm run build`, so a
misconfigured deploy cannot reach production.

---

## First deploy

1. **Import the repo** at [vercel.com/new](https://vercel.com/new). Vercel
   detects Astro from `vercel.json` and needs no manual build settings:

   | Setting | Value | From |
   |---|---|---|
   | Framework | Astro | `vercel.json` |
   | Build command | `npm run build` | `vercel.json` |
   | Output directory | `dist` | `vercel.json` |
   | Node version | 22 | `.nvmrc` / `engines` |

2. **Deploy once** before attaching a domain. It will build against the
   `*.vercel.app` URL. That deployment is `noindex` and `Disallow: /` — it is
   not a preview of how production will be indexed, only of how it looks.

3. **Attach the custom domain** under Project → Settings → Domains. Add both
   the apex and `www`, and set one to redirect to the other (Vercel does the
   redirect; the old nginx config sent `www` → apex, keep that convention).

4. **Redeploy after attaching the domain.** This is the step people miss.
   `VERCEL_PROJECT_PRODUCTION_URL` is read *at build time*, so the build made
   in step 2 still carries the `*.vercel.app` origin in its canonicals.
   Trigger a fresh production deploy so the real domain gets baked in.

5. **Verify** (substitute your domain):

   ```sh
   curl -s https://YOURDOMAIN/ | grep -o 'rel="canonical" href="[^"]*"'
   curl -s https://YOURDOMAIN/robots.txt
   curl -s https://YOURDOMAIN/sitemap-0.xml | grep -c '<loc>'
   ```

   Expect the canonical to carry your domain, `robots.txt` to read
   `Allow: /` with a `Sitemap:` line on your domain, and 21 URLs in the
   sitemap. If `robots.txt` says `Disallow: /`, the build did not run as
   production — check `VERCEL_ENV`.

6. **Submit the sitemap** in Google Search Console once the domain is
   verified.

TLS, HTTP→HTTPS redirects and Brotli are handled by Vercel. There is no
certbot equivalent to run and nothing to renew.

---

## Preview deployments are not indexable

Every branch and pull request gets its own public URL. Left crawlable those
are dozens of complete copies of the site competing with production for its
own terms. So on any non-production deployment the build emits:

- `noindex,nofollow` on every page,
- `Disallow: /` in `robots.txt`,
- no sitemap at all.

This is keyed on `VERCEL_ENV`, so it needs no per-branch configuration.
`SITE_INDEXABLE=true` forces the indexable path — used by CI, and useful for
inspecting a production-shaped build locally:

```sh
SITE_URL=https://YOURDOMAIN SITE_INDEXABLE=true npm run build && npm run preview
```

---

## Deploying a change

Push to `main`. Vercel builds and promotes it. Every other branch gets a
preview URL.

`npm run build` runs `astro check`, then the build, then
`scripts/check-seo.mjs`. A failure at any stage fails the deploy, and the
previous deployment stays live.

To roll back, promote an earlier deployment from the Vercel dashboard. The
build is reproducible from the commit, so a revert also works.

---

## What `scripts/check-seo.mjs` enforces

Run it any time against a build with `npm run check:seo`. It fails on:

- a page in the sitemap that carries a `noindex` tag — the contradiction
  Search Console flags, and easy to reintroduce by changing the
  trailing-slash policy without updating the exclusion list;
- a canonical pointing at the upstream `hyperporter.com` origin;
- canonicals spanning more than one origin;
- a canonical or `og:url` that does not point at the page it is on;
- an indexable page with no `<title>`, description, canonical or `og:image`;
- an `og:image` that is not an absolute URL — relative ones yield no preview
  at all, since every consumer fetches them off-origin;
- a sitemap emitted alongside a `Disallow: /` robots.txt.

It does **not** judge content quality. See the open items below for that.

---

## URL shape

Canonical form carries **no trailing slash** — `/autopilot`, not
`/autopilot/`. Every internal link in the codebase is written that way, so
canonicals, OG URLs and the sitemap follow, and `vercel.json` sets
`"trailingSlash": false` so the slashed form 308s to it. One crawlable URL
per page, and no redirect hop on internal navigation.

Changing this means changing all three together — `trailingSlash` in
`astro.config.mjs`, `trailingSlash` in `vercel.json`, and the `noindexPaths`
set in `astro.config.mjs`.

---

## Inherited Docker stack

`Dockerfile`, `docker-compose*.yml`, `nginx/` and
`scripts/init-letsencrypt.sh` came from the original repository, which
self-hosts. They still work, and `docker-compose.dev.yml` is a convenient
way to run the site without installing Node. They are not part of the Vercel
deploy.

One change: `SITE_URL` no longer defaults to `hyperporter.com` in the
Dockerfile or compose file. It is required — set it in a `.env` file beside
`docker-compose.yml`. A build without it fails rather than silently baking
the other site's domain into this one's pages.

---

## Open items

These are not deployment blockers, but they are launch blockers.

**Content**

- **The 7 blog posts are byte-identical to the original site's.** They are
  indexable and in the sitemap on both domains, so the two will compete and
  Google will suppress one. Rewriting them is the single highest-value SEO
  task here. Until then, expect them not to rank.
- **All 137 destination pages are `noindex`** and excluded from the sitemap
  (`index: false` in each file's frontmatter). They currently share
  near-identical copy, so indexing them as-is risks a thin-content penalty.
  This is the site's largest potential SEO asset and it is dormant by
  choice — give a page genuinely unique material, then set `index: true` in
  its frontmatter and it joins the sitemap automatically. Do this in
  batches, not all 137 at once.
- **`/about` has three "Name pending" bios**, and is `noindex` until they
  are real.
- **`/terms` and `/privacy` are unreviewed drafts** — written to match how
  the product actually works, but not checked by counsel. `noindex` until
  they are.
- **Country count**: the copy says 137 and the dataset holds 137, but an
  earlier brief said "100+" and the original site said "130+". Confirm the
  real number.
- **The two award badges** ("Hospitality B2B Travel Partner", "UN Tourism
  Winner") were removed from the destination pages pending verification.
  Restore only once confirmed.

**Assets**

- **Per-destination `og:image`.** Every page currently shares one card
  (`public/og.png`, 1200×630, drawn from the homepage hero — source in
  `scripts/og/card.html`, regenerate with `node scripts/og/render.mjs`).
  Giving each destination its own card means rasterising the landmark SVGs,
  which is a larger job. The shared card is a real improvement over the bare
  text card a missing `og:image` produces, but a destination-specific one
  would convert better.
- **`public/hero.jpg` is a placeholder** pending licensed photography, as are
  the generated destination illustrations.
- **`/preview/oh` and `/preview/brandigo`** are throwaway design studies.
  They are `noindex` and out of the sitemap, but they do ship to the public
  domain. Consider removing them before launch.

**Licensing**

- **Hyperlocal ROM** (`public/fonts/hyperlocal-rom-regular.woff2`) is
  supplied under a **desktop** licence whose terms forbid "storing on
  publicly available servers". Serving it as a webfont is exactly that.
  Shipping it here is a deliberate decision, carried over from the original
  site; a Dinamo **web** licence is still required. The fallback stack in
  `global.css` is what the site drops to if it does not come through.
