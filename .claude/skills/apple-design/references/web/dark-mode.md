# Dark mode

> HIG source: `../hig/dark-mode.md`

## The rule Apple leads with

> **HIG — Dark Mode**: "Avoid offering an app-specific appearance setting… people may think
> your app is broken because it doesn't respond to their systemwide appearance choice."

On the web, translate that as: **follow the OS by default.** A theme toggle is fine — the web
has weaker OS integration than an app, and users expect one — but it must start at *system*
and it must have three states, not two:

```html
<!-- html.dark / html.light override; absent = follow the OS -->
```

```css
:root { color-scheme: light dark; }
```

`color-scheme` is not optional. It's what makes form controls, scrollbars, and the pre-paint
canvas render dark, and it prevents the white flash before your CSS applies.

Set the theme before first paint, in a blocking inline script in `<head>`, reading
`localStorage` then `matchMedia('(prefers-color-scheme: dark)')`. Any later and the user sees
a white flash.

## Dark is not an inversion

Some colours invert, some don't. `#FFFFFF` text on `#000000` is harsher than black-on-white
and causes halation for astigmatic readers.

- **Dim the backgrounds, brighten the foregrounds** — but not to the extremes. Apple's dark
  surfaces are `#000000` → `#1C1C1E` → `#2C2C2E` → `#3A3A3C`, and body text sits at 100% white
  only for primary labels.
- **Desaturate large fields of colour.** A brand colour at full chroma on black vibrates. Take
  10–20% saturation out and raise lightness.
- **Brighten accents.** `#007AFF` → `#0A84FF`. The light-mode blue reads muddy on dark.
- **Shadows barely work on dark.** Depth comes from *lighter* surfaces, not darker shadows.

## Elevation

In light mode, elevated surfaces get a shadow. **In dark mode, elevated surfaces get lighter.**

| Layer | Light | Dark |
|-------|-------|------|
| Page | `#FFFFFF` | `#000000` |
| Card / raised | `#FFFFFF` + shadow | `#1C1C1E` |
| Popover / menu | `#FFFFFF` + larger shadow | `#2C2C2E` |
| Modal / sheet | `#FFFFFF` + large shadow | `#2C2C2E` |
| Highest overlay | `#FFFFFF` | `#3A3A3C` |

This is Apple's base/elevated split: a sheet or popover in the foreground gets the elevated
palette so it advances, while the interface behind it recedes. Cap it at three levels — more
and the differences stop being readable.

## Implementation

Define light as the default, override in dark. Do it twice so a manual toggle wins in both
directions:

```css
:root {
  --bg: #FFFFFF;
  --text-primary: #000000;
  --text-secondary: rgb(60 60 67 / 0.60);
  --accent: #007AFF;
}

@media (prefers-color-scheme: dark) {
  :root:not(.light) {
    --bg: #000000;
    --text-primary: #FFFFFF;
    --text-secondary: rgb(235 235 245 / 0.60);
    --accent: #0A84FF;
  }
}

:root.dark {
  --bg: #000000;
  --text-primary: #FFFFFF;
  --text-secondary: rgb(235 235 245 / 0.60);
  --accent: #0A84FF;
}
```

Never let a colour's *only* definition live inside a media query — a token defined only in the
dark block is undefined in light.

`light-dark()` collapses this where you don't need a class override:

```css
:root { color-scheme: light dark; --bg: light-dark(#FFFFFF, #000000); }
```

## Images and media

- **Soften white backgrounds.** A product shot on white glows in dark mode. Either wrap it in
  a container with a matching surface colour, or dim it slightly:
  `filter: brightness(0.9)` under `prefers-color-scheme: dark`.
- **Ship both variants where it matters** — logos, diagrams, screenshots, illustrations with
  outlines. `<picture>` with `media="(prefers-color-scheme: dark)"`.
- **Icons should be currentColor SVG** so they follow the text token automatically. A PNG icon
  set means two PNG icon sets.
- **Never a global `filter: invert()`.** It wrecks photos, logos and shadows.

## Verification

- Body text ≥ 4.5:1 in both themes; aim for 7:1 on custom colours in dark.
- No pure-white large surfaces left over in dark mode — `<dialog>`, `<iframe>`, embedded
  widgets, syntax-highlighting themes, chart libraries and map tiles all need checking.
- Focus rings visible on dark surfaces (a `#000` ring on `#1C1C1E` is invisible).
- Test dark + `prefers-contrast: more` together — the HIG calls this out specifically as
  where dark text on dark backgrounds stops being legible.
- Test the switch happening live; a user on Auto will flip themes mid-session.
