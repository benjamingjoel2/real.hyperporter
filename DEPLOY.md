# Deploying Hyperporter (self-hosted)

> **This repository deploys to Vercel — see [VERCEL.md](VERCEL.md).**
>
> This document describes the original site's self-hosted Docker + nginx
> stack, inherited when this repo was forked. Those files still work and
> `docker-compose.dev.yml` is a handy way to run the site without installing
> Node, but the server and domain below belong to the original deployment.
>
> One change since the fork: `SITE_URL` is now **required** rather than
> defaulting to `hyperporter.com`, so a build here cannot silently bake the
> other site's domain into this one's canonical tags. Set it in a `.env`
> file beside `docker-compose.yml`.

The site is a fully static Astro build. Docker builds it and nginx serves
it. Nothing runs server-side at request time.

---

## Local preview (any machine, no Node install needed)

```sh
docker compose -f docker-compose.dev.yml up
```

Then open <http://localhost:4321>. Edits to `src/` hot-reload.

If you'd rather run it natively — Node 22 (see `.nvmrc`):

```sh
npm ci
npm run dev
```

To preview the *production* build rather than the dev server:

```sh
npm run build && npm run preview
```

---

## First-time server setup

Only needed once, on a fresh server.

**Prerequisites**

- Docker Engine with the Compose plugin.
- DNS `A` records for `hyperporter.com` **and** `www.hyperporter.com`
  pointing at the server, and actually resolving. Check before continuing —
  certificate issuance fails if they don't:
  ```sh
  dig +short hyperporter.com
  dig +short www.hyperporter.com
  ```
- Ports 80 and 443 open on the firewall.

**Steps**

```sh
git clone https://github.com/benjamingjoel2/real.hyperporter.git /opt/hyperporter
cd /opt/hyperporter

# Issue the TLS certificate. Run this ONCE, before the first `up`.
# Do a dry run against Let's Encrypt's staging CA first:
STAGING=1 ./scripts/init-letsencrypt.sh

# If that completes cleanly, get the real certificate:
rm -rf data/certbot
./scripts/init-letsencrypt.sh

docker compose up -d --build
```

Why the staging run: the production CA rate-limits **failed** issuance
attempts per domain per week. A wrong DNS record can burn through that
allowance and lock you out for days. The staging CA has no meaningful
limit, so use it to prove the setup works, then switch.

Why the script exists at all: `nginx/default.conf` references certificate
files, and nginx won't start if they're missing — but certbot needs a
running nginx to answer the ACME challenge. The script breaks that deadlock
with a temporary self-signed cert, then replaces it with the real one.

---

## Deploying a change

**The live checkout is `/opt/hyperporter`**, not a home directory. Merge to
`main` first — the server pulls from `main`, so nothing that is still on a
branch will appear.

Run it as a single command from your own machine rather than an interactive
session. The server is small enough that it drops SSH sessions while
building, and anything typed after that silently runs on your laptop
instead:

```sh
ssh root@hyperporter.com 'cd /opt/hyperporter && git pull --no-edit origin main && nohup docker compose up -d --build > /tmp/deploy.log 2>&1 < /dev/null &'
```

That returns in seconds. The build keeps going on the server because it is
detached — that is what `nohup` and the redirects are for. Allow five to
ten minutes.

Check on it as often as you like:

```sh
ssh root@hyperporter.com 'tail -30 /tmp/deploy.log; echo ---; cd /opt/hyperporter && docker compose ps'
```

Done when `web` reads `healthy` and the log ends with `Started`. Then:

```sh
curl -sI https://hyperporter.com | head -1   # HTTP/2 200
```

The build runs inside Docker, so the server needs no Node toolchain.

If `git pull` stops on divergent branches, someone has committed on the
server — Mau has done this for TLS fixes. Merge rather than overwrite, or
you will throw that work away:

```sh
ssh root@hyperporter.com 'cd /opt/hyperporter && git config pull.rebase false && git pull --no-edit origin main'
```

### Building on the server is the weak point

The box builds the site while also serving it, which is why it becomes
unresponsive and drops connections mid-deploy. Moving the build to GitHub
Actions — CI builds, the server downloads a finished `dist/` — removes the
problem. Not done yet.

---

## How it fits together

| Piece | Role |
|---|---|
| `Dockerfile` | Two stages: Node 22 builds the static site, nginx serves it. |
| `docker-compose.yml` | Production: `web` (nginx, ports 80/443) + `certbot` (renewals). |
| `docker-compose.dev.yml` | Local dev server with hot reload. Not used on the server. |
| `nginx/default.conf` | HTTP→HTTPS redirect, www→apex, static serving, caching, 404. |
| `scripts/init-letsencrypt.sh` | One-time TLS bootstrap. |
| `data/` | Certificates and ACME webroot. Created on the server, **git-ignored** — never commit it. |
| `/opt/hyperporter` | Where the checkout lives on the production server. |

### Certificate renewal

The `certbot` service checks twice daily and renews when a certificate is
within 30 days of expiry. `web` reloads nginx every 6 hours so a renewed
certificate is picked up without intervention. No cron needed.

### The `SITE_URL` build argument

The site is static, so canonical tags, OG URLs, `sitemap.xml` and
`robots.txt` are **baked in at build time** from `SITE_URL`. It defaults to
`https://hyperporter.com`.

This matters: a build made with the wrong origin will serve wrong canonical
tags even though the pages look fine. To deploy to a different hostname,
set it in a `.env` file beside `docker-compose.yml`:

```
SITE_URL=https://staging.hyperporter.com
```

### If you'd rather terminate TLS on the host

If you already run nginx or a reverse proxy on the host, drop the `certbot`
service and change `web`'s port mapping to something local
(e.g. `"127.0.0.1:8080:80"`), then proxy to it. In that case the HTTPS
server blocks in `nginx/default.conf` can be reduced to the plain HTTP one.

---

## Before this goes public

Not blockers for standing the server up, but they need resolving before the
site is promoted:

- **`/terms` and `/privacy` are unreviewed drafts.** Written to match how
  the product actually works, but not checked by a lawyer. Both are
  `noindex` and excluded from the sitemap until they are.
- **`/about` has three "Name pending" placeholder bios.** Also `noindex`
  for that reason.
- **All 137 destination pages are `noindex`** and out of the sitemap. They
  currently share near-identical copy, so indexing them as-is risks a
  thin-content penalty. Each needs genuinely unique material, then
  `index: true` in its frontmatter.
- **"130+ countries"** appears in the marketing copy; the dataset holds
  137, and an earlier brief said "100+". Needs one agreed number.
- **The two award badges** on every destination page
  ("Hospitality B2B Travel Partner", "UN Tourism Winner") are carried over
  from the old site and unverified.
- **`public/hero.jpg`** and the generated destination illustrations are
  placeholders pending licensed photography.
