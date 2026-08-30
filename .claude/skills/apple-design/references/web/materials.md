# Materials, translucency and Liquid Glass

> HIG source: `../hig/materials.md`, `../hig/liquid-glass.md`

Materials create depth by letting colour pass through from background to foreground. Used
well, they establish which layer is content and which is control without a single border.
Used badly, they are unreadable frosted mush.

## Two layers

Liquid Glass — Apple's 2025 design language — draws a hard line:

1. **Content layer** — text, media, lists. Solid surfaces, standard materials.
2. **Functional layer** — navigation and controls that float above it. Glass.

> **HIG — Liquid Glass**: "Don't use Liquid Glass in the content layer… Including it in the
> content layer creates unnecessary complexity and confusing visual hierarchy."

Do glass: sticky headers, floating toolbars, sidebars, tab bars, command palettes, primary
floating CTAs, overlay controls on media.

Don't glass: cards, list rows, page backgrounds, form panels, or "everything" because it
looks expensive. Overuse dilutes emphasis until nothing reads as elevated.

Exception the HIG allows: a transient control in the content layer (a slider, a toggle) may
take on the glass appearance *while active*, to signal interactivity.

## Two variants

**Regular** — blurs and adjusts luminosity to guarantee legibility. Use where there's real
text: headers, sidebars, popovers, alerts. This is the default; most components want it.

**Clear** — highly translucent, prioritises the content beneath. For controls floating over
photos and video. Requires a dimming layer (~35% black) when the underlying content is
bright; none needed when it's already dark.

## CSS

```css
.glass-regular {
  background: rgb(255 255 255 / 0.72);
  backdrop-filter: blur(30px) saturate(1.4);
  -webkit-backdrop-filter: blur(30px) saturate(1.4);
  border-bottom: 1px solid var(--separator);
}

@media (prefers-color-scheme: dark) {
  .glass-regular { background: rgb(28 28 30 / 0.72); }
}

.glass-clear {
  background: rgb(0 0 0 / 0.18);
  backdrop-filter: blur(16px) saturate(1.3);
  -webkit-backdrop-filter: blur(16px) saturate(1.3);
}
```

Target values:

| Property | Regular | Clear |
|----------|---------|-------|
| Blur radius | 20–40px | 10–20px |
| Background opacity | 0.6–0.8 | 0.3–0.5 |
| Saturation boost | 1.2–1.5× | 1.2–1.5× |

The saturation boost is what separates convincing glass from grey haze — it's Apple's
vibrancy effect. Blur alone desaturates whatever is behind it and looks dead.

`-webkit-` prefix still required for Safari. Always ship both.

## Thickness

Standard (non-glass) materials for structure *within* the content layer:

| Level | Opacity | Use |
|-------|---------|-----|
| Ultra-thin | ~0.4 | Full-screen overlays that should barely veil |
| Thin | ~0.55 | Overlays needing a light scheme, emphasis on an element |
| Regular | ~0.72 | Default: bars, popovers, section separators |
| Thick | ~0.85 | Overlays needing a dark scheme, distinct panels |

Choose by *semantic role*, not by how it looks in your one test screenshot — the appearance
changes with the content behind it.

## Colour on glass

By default glass has no colour of its own; text and icons on it go monochrome — darker over
light content, lighter over dark. Apply colour sparingly:

- **Background colour** for the one primary action in a context. More effective than tinting
  the label.
- **Foreground colour** for selected state (the active nav item).
- **Only one** background-tinted control per context.
- Over a colourful page, keep bars monochrome. Colour on colour is unreadable.
- Watch overlap: if the content layer and the glass layer share a hue, the glass disappears.
  Check the resting state — the top of the scroll — where it's most likely to fail.

## Scroll edge effect

Apple's bars don't have a hard background; they blur and fade content approaching the edge, so
the bar's legibility is guaranteed without a visible box:

```css
.scroll-edge {
  position: sticky; top: 0;
  background: linear-gradient(to bottom, var(--bg) 0%, rgb(255 255 255 / 0) 100%);
  backdrop-filter: blur(12px);
  mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
}
```

Prefer this over a solid bar with a bottom border. It's the single most recognisable Apple
detail on the web and it costs almost nothing.

## Non-negotiables

**Legibility first, always.** If text on the material fails 4.5:1 against any part of what can
scroll behind it, the material is wrong — raise opacity, add a scrim, or use a solid surface.

**Fallbacks, twice over:**

```css
@supports not (backdrop-filter: blur(1px)) {
  .glass-regular { background: var(--bg); }
}

@media (prefers-reduced-transparency: reduce) {
  .glass-regular { background: var(--bg); backdrop-filter: none; }
}
```

Apple exposes Reduce Transparency as a first-class accessibility setting for a reason: for
some users, translucency makes text unreadable. Honour it.

**Performance.** `backdrop-filter` is expensive — it forces a new compositing layer and
re-rasterises on scroll. A handful of elements is fine; a grid of thirty glass cards will
stutter on mid-range hardware and drain battery. Another reason glass belongs on the
functional layer only.

**Borders.** Glass gets a 1px hairline at the separator colour, or a subtle inner highlight
(`box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.1)`) — never a heavy outline.
