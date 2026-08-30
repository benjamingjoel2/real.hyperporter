# Typography

> HIG source: `../hig/typography.md`, `../hig/writing.md`

Apple's type system is one typeface, eleven roles, and disciplined restraint. The whole
hierarchy of an iOS app is built from size, weight and colour — never from a second display
face, and never from decorative styling.

## Font stacks

```css
--font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI Variable",
             "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--font-serif: ui-serif, "New York", "Iowan Old Style", Charter, Georgia, serif;
--font-mono: ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace;
--font-rounded: ui-rounded, "SF Pro Rounded", system-ui, sans-serif;
```

`-apple-system` gets you real SF on Apple devices at zero cost — no webfont, no layout shift,
no licence. Use it whenever a neutral system voice is right. `ui-rounded` softens numerals and
labels; use it for soft/friendly UI, not for long text.

If the brand needs a custom face, keep the system stack as the fallback and add
`font-optical-sizing: auto` plus `font-synthesis: none`. Load with `font-display: swap` and
preload the one weight that appears above the fold.

Set `-webkit-font-smoothing: antialiased` only on dark backgrounds or genuinely large display
type — applied globally to light-mode body copy it thins letterforms and *costs* legibility.

## The scale

Apple's iOS text styles, at 1pt = 1px. This is the default scale; take steps out, don't add
new ones in.

| Role | Size | Line height | Weight | Tracking |
|------|------|-------------|--------|----------|
| Large title | 34px | 41px | 400 / 700 | -0.02em |
| Title 1 | 28px | 34px | 400 / 700 | -0.02em |
| Title 2 | 22px | 28px | 400 / 700 | -0.01em |
| Title 3 | 20px | 25px | 400 / 600 | -0.01em |
| Headline | 17px | 22px | 600 | 0 |
| Body | 17px | 22px | 400 | 0 |
| Callout | 16px | 21px | 400 | 0 |
| Subheadline | 15px | 20px | 400 | 0 |
| Footnote | 13px | 18px | 400 | 0 |
| Caption 1 | 12px | 16px | 400 | +0.005em |
| Caption 2 | 11px | 13px | 400 | +0.01em |

Two things this table is not:

- **Not a web display scale.** For marketing heroes, extend above Large title with a fluid
  step: `clamp(2.5rem, 1.5rem + 4vw, 5rem)` at `line-height: 1.05` and `letter-spacing: -0.03em`.
  Tighten tracking as size grows; that negative tracking is most of what makes large type
  look Apple-made.
- **Not the dense-UI scale.** macOS runs a 13px body. For dashboards and data tables use
  15px body / 13px secondary / 11px labels, and keep 17px for prose.

Line height rule of thumb: **1.5 for prose, 1.2–1.3 for headings, 1.1 or less for display.**

## Weights

Regular 400, Medium 500, Semibold 600, Bold 700. That's the working set.

Avoid 100–300 entirely. Thin and Light weights fail at small sizes, on low-DPI screens, and
for low-vision users — the HIG says so directly, and a light-weight hero on a light background
is the single most common way a design that "looks Apple" fails an accessibility audit.

Emphasis is Semibold. Bold is for the rare thing that outranks Semibold. If you find yourself
needing a fourth level, the layout is the problem.

## Measure and rhythm

- Prose line length: **60–75 characters.** `max-width: 65ch` on the text container.
- Never justify text on the web; ragged right, `hyphens: auto` only in narrow columns.
- `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs — cheap, big improvement.
- Numerals in tables and anything that updates live: `font-variant-numeric: tabular-nums`.

## Scalable text

The HIG requires Dynamic Type support. The web equivalent:

- Size body text in `rem` so the browser's font-size setting applies. Never `font-size` in
  `px` on paragraphs.
- Never `maximum-scale=1` or `user-scalable=no` in the viewport meta. That's a hard
  accessibility failure.
- Test at 200% zoom. Layout must reflow, not truncate or overlap.
- At large sizes, stack what was side-by-side rather than letting inline metadata crowd the
  text — the HIG asks for exactly this.
- Preserve relative hierarchy at every size: a heading stays visibly bigger than its body.

## Case and copy

- **Sentence case** for headings, buttons, labels, menu items. Not Title Case, not ALL CAPS.
- ALL CAPS only for short eyebrow labels, and then with `+0.06em` tracking — never for a
  sentence, and never for anything a screen reader reads letter by letter.
- Buttons name the verb: "Save changes", not "OK". "Delete photo", not "Confirm".
- Front-load the meaningful word — people scan the first two words of a label.

See `../hig/writing.md` for the full copy guidance.
