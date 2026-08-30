# Colour

> HIG source: `../hig/color.md`, `../hig/dark-mode.md`

The HIG says: don't hard-code system colours, use the semantic API. **On the web there is no
system colour API — you have to be it.** So the rule becomes: define semantic tokens once,
give every one a light and a dark value, and never let a component touch a raw hex.

## Token architecture

Three layers. Components only ever see layer 3.

1. **Primitives** — raw palette values. `--blue-500: #007AFF`. Never referenced by a component.
2. **Semantic** — meaning. `--text-secondary`, `--fill-tertiary`, `--separator`, `--accent`.
3. **Component** — optional local aliases. `--button-bg: var(--accent)`.

A semantic token is named for what it *does*, never for what it looks like. `--text-secondary`,
not `--grey-60`. The instant you write `--grey-60` into a component, dark mode is dead.

> **HIG — Color**: "Avoid redefining the semantic meanings of dynamic system colors… don't use
> the separator color as a text color, or secondary text label color as a background color."

## Content colours (light / dark)

Apple layers content colour with alpha, not with solid greys — so it composites correctly over
any background, including materials.

| Token | Light | Dark |
|-------|-------|------|
| `--text-primary` | `#000000` | `#FFFFFF` |
| `--text-secondary` | `rgb(60 60 67 / 0.60)` | `rgb(235 235 245 / 0.60)` |
| `--text-tertiary` | `rgb(60 60 67 / 0.30)` | `rgb(235 235 245 / 0.30)` |
| `--text-quaternary` | `rgb(60 60 67 / 0.18)` | `rgb(235 235 245 / 0.16)` |
| `--separator` | `rgb(60 60 67 / 0.29)` | `rgb(84 84 88 / 0.65)` |
| `--separator-opaque` | `#C6C6C8` | `#38383A` |

**Contrast warning.** `--text-tertiary` and `--text-quaternary` do *not* meet 4.5:1. They are
for placeholders, disabled states and decorative dividers only. Never body copy, never a
caption a user is expected to read, never a form hint that carries meaning. This is the most
frequently broken rule in Apple-styled web work.

## Fills

Neutral fills for control backgrounds, chips, track rails. Translucent by design.

| Token | Light | Dark |
|-------|-------|------|
| `--fill-primary` | `rgb(120 120 128 / 0.20)` | `rgb(120 120 128 / 0.36)` |
| `--fill-secondary` | `rgb(120 120 128 / 0.16)` | `rgb(120 120 128 / 0.32)` |
| `--fill-tertiary` | `rgb(118 118 128 / 0.12)` | `rgb(118 118 128 / 0.24)` |
| `--fill-quaternary` | `rgb(116 116 128 / 0.08)` | `rgb(118 118 128 / 0.18)` |

## Backgrounds

| Token | Light | Dark (base) | Dark (elevated) |
|-------|-------|-------------|-----------------|
| `--bg` | `#FFFFFF` | `#000000` | `#1C1C1E` |
| `--bg-secondary` | `#F2F2F7` | `#1C1C1E` | `#2C2C2E` |
| `--bg-tertiary` | `#FFFFFF` | `#2C2C2E` | `#3A3A3C` |

Grouped variant, for pages that are mostly cards or list sections — the page sits back and the
cards come forward:

| Token | Light | Dark |
|-------|-------|------|
| `--bg-grouped` | `#F2F2F7` | `#000000` |
| `--bg-grouped-secondary` | `#FFFFFF` | `#1C1C1E` |
| `--bg-grouped-tertiary` | `#F2F2F7` | `#2C2C2E` |

Note the inversion: in light mode cards are *lighter* than the page; in dark mode they are
*lighter* too. Elevation always moves toward light. See `dark-mode.md`.

## System palette

| Colour | Light | Dark |
|--------|-------|------|
| Red | `#FF3B30` | `#FF453A` |
| Orange | `#FF9500` | `#FF9F0A` |
| Yellow | `#FFCC00` | `#FFD60A` |
| Green | `#34C759` | `#30D158` |
| Mint | `#00C7BE` | `#63E6E2` |
| Teal | `#30B0C7` | `#40C8E0` |
| Cyan | `#32ADE6` | `#64D2FF` |
| Blue | `#007AFF` | `#0A84FF` |
| Indigo | `#5856D6` | `#5E5CE6` |
| Purple | `#AF52DE` | `#BF5AF2` |
| Pink | `#FF2D55` | `#FF375F` |
| Brown | `#A2845E` | `#AC8E68` |

Greys — light: `#8E8E93` `#AEAEB2` `#C7C7CC` `#D1D1D6` `#E5E5EA` `#F2F2F7`.
Dark: `#8E8E93` `#636366` `#48484A` `#3A3A3C` `#2C2C2E` `#1C1C1E`.

**These are vivid, saturated colours designed for glyphs, badges and fills — not for text.**
`#007AFF` on white is 4.0:1. That clears 3:1 — enough for an icon, a control boundary or
genuinely large display text — but it fails the 4.5:1 body-text minimum, so a 15px link or a
white label on a `#007AFF` button is a real AA failure. Darken it for text: `#0060DF` is
5.6:1 on white. Apple ships these values in contexts where the OS also offers Increase
Contrast; on the web you have no such safety net.

Semantic assignments: red = destructive/error, orange = warning, green = success/confirmed,
blue = default interactive/informational. Don't reassign these; users arrive with the mapping
already learned.

## Accent

One accent. It marks the primary action and the current selection, and nothing else.

```css
--accent: #007AFF;
--accent-hover: #0071EB;
--accent-pressed: #0062CC;
--accent-contrast: #FFFFFF;   /* text on top of --accent */
--accent-subtle: rgb(0 122 255 / 0.12);  /* selected row, tinted chip */
```

Dark mode uses the brighter variant (`#0A84FF`) — the light-mode blue goes muddy on black.

If the project has a brand colour, that becomes `--accent` and the Apple blue never appears.
Verify the brand colour hits 4.5:1 as text and 3:1 as a boundary in *both* themes; most brand
palettes need a darkened variant for light-mode text and a lightened one for dark.

## Contrast requirements

| Content | Minimum |
|---------|---------|
| Body text — anything below the large-text threshold | 4.5:1 |
| Large text — ≥ 24px, or ≥ 18.66px bold | 3:1 |
| Icons and graphics that carry meaning | 3:1 |
| UI component boundaries (input borders, toggles) | 3:1 |
| Focus indicator against adjacent colour | 3:1 |
| Disabled / decorative | exempt, but must not look enabled |

The HIG asks for **7:1 on custom colours in dark mode**, especially small text. Aim there.

Note the unit trap: the HIG's table is in iOS points, where 18pt = 18 CSS px. WCAG's 18pt is
a typographic point — 24 CSS px. **Use the WCAG figures on the web**; they're what an audit
will measure, and they're the stricter of the two.

Check contrast against what's actually behind the text — over an image or a material, the
computed value is whatever the composite is, and it changes as the user scrolls. Put a scrim
under text on imagery rather than hoping.

## Increased contrast

```css
@media (prefers-contrast: more) {
  :root {
    --text-secondary: rgb(60 60 67 / 0.85);
    --separator: rgb(60 60 67 / 0.55);
    --fill-tertiary: rgb(118 118 128 / 0.24);
  }
}
```

Strengthen separators and secondary text, replace translucency with opaque equivalents, and
give ghost buttons a real border.

## Practical rules

- Test in both themes and under `prefers-contrast: more` before calling anything finished.
- Colours look different in bright sun and in dark rooms; if it's borderline on your monitor
  it's broken on a phone outdoors.
- Watch cultural meaning — red is danger in some places and fortune in others
  (`../hig/inclusion.md`).
- Give images an sRGB profile. Use Display P3 (`color(display-p3 …)`) with an sRGB fallback
  only when the extra saturation earns its keep.
