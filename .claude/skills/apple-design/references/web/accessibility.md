# Accessibility

> HIG source: `../hig/accessibility.md`, `../hig/inclusion.md`, `../hig/right-to-left.md`

Not a phase. Not a checklist at the end. An accessibility failure is a **Critical** finding in
any review, outranking every visual concern.

## Contrast

| Content | Minimum | HIG target |
|---------|---------|------------|
| Body text, any weight | 4.5:1 | 4.5:1 |
| Large text — ≥ 24px, or ≥ 18.66px bold | 3:1 | 3:1 |
| Custom colours in dark mode | 4.5:1 | **7:1**, especially small text |
| Icons/graphics carrying meaning | 3:1 | 3:1 |
| Input borders, control boundaries | 3:1 | 3:1 |
| Focus indicator vs adjacent | 3:1 | 3:1 |

The HIG states these thresholds in iOS points (18pt = 18 CSS px). WCAG states them in
typographic points (18pt = 24 CSS px). **Use the WCAG figures on the web** — stricter, and
they're what tooling measures.

Measure the composite. Text over an image, a gradient or a `backdrop-filter` has whatever
contrast the pixels behind it happen to give — which changes as the page scrolls. Put a scrim
or a solid plate under it.

Usual suspects: placeholder text, "subtle" captions, disabled labels that still carry
information, grey-on-grey secondary text, brand colour used for small links, white text on a
mid-tone accent.

## Target size

| Input | Minimum | Comfortable |
|-------|---------|-------------|
| Touch | 44×44 px | 48×48 |
| Pointer | 24×24 px (WCAG 2.2) | 28×28 (HIG desktop) |

The **hit box**, not the glyph. Grow it with padding or a pseudo-element:

```css
.icon-btn { position: relative; }
.icon-btn::after { content: ""; position: absolute; inset: -12px; }
```

Spacing counts as much as size: ~12px between elements with a visible bezel, ~24px around
bare glyphs. Adjacent 44px targets with 0px between them still produce mis-taps.

## Keyboard

- Everything interactive is reachable with Tab, in visual order. If DOM order and visual order
  disagree, fix the DOM — don't paper over it with `tabindex`.
- Positive `tabindex` values are always a bug. `tabindex="0"` and `tabindex="-1"` only.
- Visible focus ring, in both themes:

```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: inherit;
}
```

  `outline: none` without a replacement is a critical defect. `:focus-visible` (not `:focus`)
  keeps the ring off mouse clicks while preserving it for keyboard users.
- Escape closes modals, popovers and menus. Enter/Space activate. Arrow keys move within
  composite widgets (tabs, menus, listboxes) — not Tab.
- Modals trap focus and return it to the trigger on close.
- A skip link before the nav: visually hidden until focused.

## Screen readers

- **Semantic HTML first.** `<button>`, `<nav>`, `<main>`, `<h1>`–`<h6>` in order, `<label for>`,
  `<dialog>`. ARIA is a patch for what HTML can't express, not a substitute.
- Icon-only buttons need an accessible name — visually hidden text or `aria-label`. "Close",
  not "×".
- Every `<img>` has `alt`. Decorative images get `alt=""`. Informative alt text describes the
  information, not the picture: "Revenue up 12% quarter on quarter", not "line chart".
- Announce async changes with `aria-live="polite"` (`assertive` only for errors that interrupt).
- `aria-hidden="true"` on decorative SVG.
- Never remove content from the accessible tree because it's visually hidden but readable —
  and never leave hidden content focusable.

## Motion sensitivity

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

That's the floor. Beyond it: kill parallax, autoplaying video, carousels that advance
themselves, and large-scale transforms. Cross-fades are usually a safe substitute for
movement. Opacity and colour transitions can stay — they don't trigger vestibular symptoms.

Also honour `prefers-reduced-transparency: reduce` — replace `backdrop-filter` surfaces with
opaque ones (see `materials.md`).

## Zoom and reflow

- 200% zoom, no horizontal scroll, no clipped content, no overlapping text.
- 320px viewport width still works.
- Never `user-scalable=no` or `maximum-scale=1`.
- Size body text in `rem`; respect the browser's root font size.

## Beyond the checklist

- **Nothing communicated by colour alone.** Pair with icon, text, shape or position.
- **Don't rely on hover.** Touch has no hover. Anything only reachable on hover is unreachable
  for a large share of users. Hover reveals *enhancements*, never the only path to an action.
- **Give people time.** No auto-dismissing content the user must read; no session timeout
  without warning and extension.
- **Errors recover.** Say what went wrong, in plain language, and how to fix it — next to the
  field, tied by `aria-describedby`.
- **Undo over confirm.** A reversible action with an undo affordance beats a confirmation
  dialog everyone dismisses reflexively. Destructive and irreversible still gets a confirm,
  with the verb named ("Delete 4 files").
- **Logical order in RTL.** `padding-inline`, `margin-inline`, `start`/`end`, and flexbox/grid
  flow — not `left`/`right`. See `../hig/right-to-left.md`.

## Testing

Automated tooling (axe, Lighthouse) catches roughly a third of real issues. Then, by hand:

1. Unplug the mouse. Complete the primary task.
2. Turn on VoiceOver (Cmd+F5) or NVDA. Complete it again.
3. Zoom to 200%, then narrow to 320px.
4. Toggle dark mode, `prefers-contrast: more`, `prefers-reduced-motion`.
5. Run the page through a greyscale filter — anything that disappears was colour-only.
