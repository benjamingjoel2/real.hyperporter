# Hyperporter — website

Context for any Claude Code session working in this repo. Read this first.

## What Hyperporter is

Travel-tech company. Two products, and they are **not** the same thing:

- **Autopilot** — the *software*. Automates the coordination workflow between traveller, travel
  agency, and ground operator (DMC). Sold as a monthly subscription.
- **Horizon** — the *partner/contact network*. Vetted local operators across many countries.
  Not software.

Three ways customers buy:

1. **Horizon only** — no software. They inquire, we run the trip through the network.
2. **Autopilot only** — they subscribe and use their own existing contacts.
3. **Autopilot + Horizon** — they subscribe, and Horizon is available inside the software.

### Terminology rules — do not break these

- Never describe Horizon as the software.
- Never describe Autopilot as the contact network.
- When referring to the platform/software, the word is **Autopilot**.
- Do not overstate automation. Payment marking is **manual** — a human confirms it.
  "Auto-confirmation" language is wrong.

## Current state of the code

`hyperporter.html` — single file, ~420KB. No build step. This is a **prototype to migrate from**,
not the long-term architecture. It contains:

- Inline CSS (custom properties, no framework) and inline JS (no dependencies).
- Google Fonts: Space Grotesk (display), IBM Plex Sans (body), IBM Plex Mono (labels/eyebrows).
- A client-side router: `go(id)` toggles `.view.on` across sections `#view-{id}`.
  **There are no real URLs.** This is the single biggest problem with the current build.

### Views

`home`, `autopilot`, `horizon`, `destinations`, `region`, `dest`, `how`, `about`, `signup`,
`blog`, `post`

### Data structures in the script block

- `POSTS` — 7 blog articles, full HTML bodies.
- `STAGES` — 9 pipeline stages, drives the Autopilot zigzag and How-It-Works spine.
- `REGIONS` — 6 entries, drives the Horizon radial diagram.
- `FEED` — 12 entries for the dispatch marquee.
- `DEST` — 7 regions containing 137 countries total.
- `DESC` — one-line description per country (all 137 covered).
- `LM` — country -> `[landmark archetype, base hue]`.
- `A` — 50 landmark illustration builders (`A.flame`, `A.savanna`, `A.taj`, …).
- `SERVICES`, `GUARANTEE` — destination page content blocks.
- `DEST_IMG` — **empty by design.** Set `DEST_IMG['Azerbaijan']='https://…'` and that
  destination uses a real photo instead of the generated illustration, in both hero and tile.

### Design system

- Dark throughout. `--void #07080A`, `--signal #46C6B9` (teal), `--amber #E8A33C`.
- Amber is reserved for human-touchpoint / manual states. Do not use it decoratively.
- Reveal-on-scroll: elements get `.rv`, IntersectionObserver adds `.in`. Re-armed on route change.
- Animations: `march` (marquees), `fly` (hero flight arcs), `run`, `spin`, `blip`.
- Full `prefers-reduced-motion` kill switch exists. Keep it.

### Illustrations

Destination artwork is **generated SVG**, not photography — 50 hand-built landmark scenes
(Flame Towers for Azerbaijan, Tiger's Nest for Bhutan, Belém Tower for Portugal, and so on),
seeded per country for palette variation. These are placeholders standing in until real
photography is licensed. Keep them as the fallback when `DEST_IMG` has no entry.

## Known gaps — these need doing

1. **No URLs.** All 137 destinations, 7 regions, and 7 blog posts are unindexable. This is why
   the migration matters more than any feature.
2. **No SEO.** No per-page title, meta description, canonical, OG tags, sitemap, robots.txt,
   structured data, or image alt text anywhere.
3. **Thin content risk.** 137 destination pages currently share near-identical copy apart from
   the country name. Google penalises this. Each page needs genuinely unique material before
   the SEO play is worth anything.
4. **About page** has three `Name pending` placeholder bios.
5. **Footer** Terms / Privacy / FAQ buttons have no handlers.
6. **Country count** — site says "130+ countries", the dataset holds 137, and a founder brief
   said "100+". Unresolved. Confirm the real number before publishing.
7. **Award badges** — "Hospitality B2B Travel Partner" and "UN Tourism Winner" have been
   REMOVED from all 137 destination pages pending confirmation. Restore only once verified.


## Design direction (current)

Light base, punctuated by full-bleed dark moments — the homepage hero, the
coverage map, the statement bands, the stats block and the footer. Structure
and restraint come from harvey.ai; the cinematic dark hero and the coverage
map come from starlink.com.

- **Display type**: Newsreader (serif). **Everything else**: Hyperlocal ROM,
  the brand cut of ABC ROM. IBM Plex Mono survives only in the dispatch rail.
- **No accent colour.** `--signal` resolves to a warm grey. Amber is the only
  colour on the site and still means one thing: a step a person must touch.
- `AppShot.astro` draws the Autopilot interface in markup, standing wherever
  the reference would put a product screenshot. Re-points per pipeline stage.
- `WorldMap.astro` + `lib/worldMap.ts`: real Natural Earth geometry projected
  to SVG at build time. 110m shapes plus centroid dots for the 13 island
  states 110m drops. Two states only — covered or not. The build **fails** if
  any destination has no geometry, so the map can never under-report.
- `lib/counts.ts` is the single source for country/region figures. Never
  hard-code them again.

### Font licence — outstanding
Hyperlocal ROM was supplied under a **desktop** licence, whose terms forbid
"storing on publicly available servers". It is live on hyperporter.com at the
founder's explicit instruction. A Dinamo **web** licence is still required.

### The ui-ux-pro-max skill loses to this file
`.claude/skills/` carries the UI/UX Pro Max plugin — 84 styles, 192 palettes,
font pairings, animation presets. It is a reference to consult, not a mandate.
Where its recommendations contradict anything above, the rules above win.
Specifically: it will suggest accent colours, gradients and motion. We have no
accent colour, amber means one thing, and restraint is the point. Do not let a
database result talk the site into decoration.

The plugin's own `design` skill is renamed locally to `design-studio` — the
name `design` collides with a built-in skill and the plugin's copy never
loaded. Re-running `npx ui-ux-pro-max-cli init` restores the colliding name;
rename it again if you do.

## Migration target

Astro (unless the CTO prefers otherwise). What it must produce:

- Content collections: `src/content/destinations/*.md`, `src/content/blog/*.md`.
  Frontmatter carries `title`, `description`, `heroImage`, `heroAlt`, `region`, `slug`.
- Real routes: `/destinations/azerbaijan`, `/regions/asia`, `/blog/{slug}`.
- Astro's image pipeline for responsive AVIF/WebP. Alt text required on every image.
- SEO component: title, meta description, canonical, OG/Twitter, JSON-LD
  (`Organization`, `TouristDestination`, `BlogPosting`).
- Auto `sitemap.xml` and `robots.txt`.
- Deploy: **Vercel, on push to `main`** — settled, see `VERCEL.md`. This repo is
  a fork serving its own domain, so nothing may hardcode `hyperporter.com`: the
  origin resolves from the environment in `src/lib/site.mjs`, and
  `scripts/check-seo.mjs` fails the build if a canonical points at the upstream
  site. Preview deployments are noindex with no sitemap.

Port the design system and the landmark SVG generator across as-is. They work.

## Working style

- Terse and direct. Explain reasoning *before* implementing, not after.
- One decision at a time; wait for confirmation before moving to the next.
- Make targeted edits. Do not rebuild or "improve" things that weren't asked about.
- Push back on overstatement, wordiness, and visual clutter.
- Short punchy lines for positioning copy. Cleanly structured prose for spec documents.
