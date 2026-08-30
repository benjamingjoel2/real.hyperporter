# Spacing and layout

> HIG source: `../hig/layout.md`

## The 4px grid

Base unit 4px. Everything — padding, margin, gap, offset, icon box, control height — is a
multiple of it, and above 24px, a multiple of 8.

| Token | Value | Typical use |
|-------|-------|-------------|
| `--space-1` | 4px | Icon-to-label, hairline gaps |
| `--space-2` | 8px | Inside a control, tight stacks |
| `--space-3` | 12px | Between related controls |
| `--space-4` | 16px | Default gap; standard viewport margin |
| `--space-5` | 20px | Card padding, desktop viewport margin |
| `--space-6` | 24px | Between form fields, list rows |
| `--space-8` | 32px | Between subsections |
| `--space-10` | 40px | Section padding, small screens |
| `--space-12` | 48px | Between sections |
| `--space-16` | 64px | Major section break |
| `--space-20` | 80px | Page section, desktop |
| `--space-24` | 96px | Hero padding |
| `--space-32` | 128px | Large marketing section |

**Proximity is the whole game.** Related items sit closer than unrelated ones, and the jump
between groups must be *obvious* — 16px inside a group and 48px between groups, not 16 and 20.
When something reads as ambiguous, the fix is almost always more space between groups, not a
border around one.

## Page margins and containers

| Viewport | Side margin | Content max width |
|----------|-------------|-------------------|
| < 480px | 16px | — |
| 480–767px | 20px | — |
| 768–1023px | 24px | 704px |
| 1024–1439px | 32px | 980px |
| ≥ 1440px | 40px | 1200px (1440px for full-bleed media) |

980px is Apple's own long-standing content column; it is a good default for marketing pages.
Reading columns stay at `65ch` regardless of container width — a wide container holds a
narrow text column, not wide text.

```css
.container { width: 100%; max-width: var(--container-lg); margin-inline: auto;
             padding-inline: var(--page-margin); }
```

Use `padding-inline`/`margin-inline`, not `left`/`right`, so RTL works for free
(`../hig/right-to-left.md`).

## Safe areas

```css
padding-inline: max(var(--page-margin), env(safe-area-inset-left));
padding-bottom: max(var(--space-4), env(safe-area-inset-bottom));
```

Needed for notched devices and installed PWAs. Also account for sticky headers with
`scroll-margin-top` on anchor targets, or in-page links land under the header.

## Corner radii

Apple uses continuous ("squircle") curvature — a smoother transition from straight edge into
curve than a circular arc. CSS `border-radius` is a circular arc, so a plain radius reads
slightly tighter than the Apple equivalent; compensate by going one step larger on big
surfaces.

| Token | Value | Use |
|-------|-------|-----|
| `--radius-xs` | 4px | Tags, badges, inline chips |
| `--radius-sm` | 6px | Inputs, small buttons |
| `--radius-md` | 10px | Buttons, list rows, popovers |
| `--radius-lg` | 14px | Cards, panels |
| `--radius-xl` | 20px | Sheets, modals, large cards |
| `--radius-2xl` | 28px | Hero surfaces, feature tiles |
| `--radius-full` | 9999px | Pills, avatars, capsule buttons |

**Nested radius rule:** inner radius = outer radius − padding. A 20px card with 12px padding
holds an 8px inner surface. Equal radii on nested surfaces look wrong and it's hard to say why.

Where supported, `corner-shape: squircle` gets you true continuous corners — treat it as
progressive enhancement, since `border-radius` remains the fallback:

```css
.card { border-radius: var(--radius-lg); corner-shape: squircle; }
```

## Control sizing

| Control | Height | Padding | Radius |
|---------|--------|---------|--------|
| Small button | 28px | 0 12px | 6px |
| Default button | 36px | 0 16px | 10px |
| Large button / primary CTA | 44px | 0 24px | 12px or full |
| Text input | 36px (44px touch) | 0 12px | 8px |
| List row | 44px min | 12px 16px | — |
| Icon button | 44×44 box | glyph 20–24px centred | 10px or full |

44px is the touch floor from `../hig/accessibility.md` — it applies to the hit box, not the
visible shape. A visually small button can still carry a 44px target via padding or a
pseudo-element.

## Structure

- **Extend content to the edges.** Backgrounds, media and scroll regions run full-bleed; the
  container constrains text, not colour.
- **Most important thing top and leading.** People read top-down, leading-to-trailing.
- **Align to a common edge.** A shared left edge across a section does more for perceived
  quality than any amount of styling.
- **Progressive disclosure.** If a collection doesn't fit, show a partial row or item so it's
  obvious there's more — never hide the fact.
- **Differentiate controls from content** with material and a scroll edge effect rather than a
  heavy bar background (see `materials.md`).

## Responsive

Breakpoints: 480 / 768 / 1024 / 1440. Design mobile-first; `min-width` queries only.

Prefer intrinsic layout over breakpoints where you can — `grid-template-columns:
repeat(auto-fit, minmax(280px, 1fr))` and `clamp()` handle most cases without a single media
query, and they adapt to container size rather than viewport size.

Container queries (`@container`) are the right tool for components that appear in a sidebar
and a main column at once.

Test at 320px. It still has to work there.
