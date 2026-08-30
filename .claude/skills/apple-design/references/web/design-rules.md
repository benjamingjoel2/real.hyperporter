# The fifteen rules

Read this for every task. Everything else in `web/` expands one of these.

Apple's three principles — **deference**, **clarity**, **depth** — are the test. The rules
below are how they cash out on the web.

---

### 1. Content is the interface

Chrome shrinks, content grows. Before adding a border, a card, a shadow or a background
tint, try removing one instead. If two elements are related, space already says so — a box
around them is a second, redundant statement.

Ask of every non-content pixel: what does it do? If the answer is "looks nice", delete it.

### 2. One accent colour, and it means one thing

An accent marks the primary action and the current selection. That's the whole job. The
moment a second unrelated thing wears it, it stops meaning anything. Everything else is
neutral: text greys, fills, separators.

> **HIG — Color**: "Avoid using the same color to mean different things."

### 3. Never state anything with colour alone

A red border, a green dot, a coloured bar — always paired with text, an icon, a shape or a
position. Roughly 1 in 12 men cannot separate red from green, and nobody can see colour in
a screenshot pasted into a black-and-white doc.

### 4. Hierarchy comes from size, weight and colour — in that order

Three levels of text emphasis is usually enough: primary, secondary, tertiary. Reach for a
weight change before a colour change, and a colour change before a size change. Never
express hierarchy by giving something a coloured background.

### 5. Type is a scale, not a set of numbers

Pick the scale in `typography.md` and use only its steps. A `19px` that appears once because
it "looked right" is a bug. Body copy sizes in `rem` so browser zoom and user font-size
settings work.

### 6. Spacing is a 4px grid

Every margin, padding, gap and offset is a multiple of 4, and above 24px, a multiple of 8.
Related things sit closer than unrelated things — and the gap between groups must be
visibly larger than the gap inside them, not marginally larger.

### 7. Optical alignment beats mathematical alignment

Icons, punctuation and glyphs need nudging. Circular shapes read small next to squares at
the same box size. Left edges of text should line up with the text, not the container.

### 8. Both themes, always, from the first line

Never ship a theme you'll "add dark mode to later". Define light and dark tokens together.
Dark mode is not an inversion — see `dark-mode.md`.

### 9. No raw values in components

Components consume semantic tokens: `var(--text-secondary)`, not `#6E6E73`; `var(--space-4)`,
not `16px`. This is what makes theming, contrast modes and rebranding possible at all.

### 10. Contrast is a floor, not a target

4.5:1 for body text, 3:1 for large text (≥24px, or ≥18.66px bold), 3:1 for UI component boundaries
and icons that carry meaning. Placeholder text, disabled labels and "subtle" captions are
where this is broken most often. Measure; do not eyeball.

### 11. Everything reachable, everything visible

Every interactive element is reachable by keyboard in a sensible order, and shows a focus
ring you can actually see — in both themes. `outline: none` without a replacement is a
critical bug. Tab order follows visual order.

### 12. 44px targets on touch, 24px minimum everywhere

The hit area, not the visible glyph. A 16px icon button gets padding until its box is 44px.
Adjacent targets need real space between them — around 12px for elements with a visible
bezel, 24px for bare ones.

### 13. Motion is feedback, never decoration

Animate to explain what moved where, or to acknowledge an action. 150ms for a press, 250–350ms
for a transition. Nothing that repeats on every interaction. Nothing that blocks input. And a
full `prefers-reduced-motion` kill switch, no exceptions.

### 14. Depth through layering, not through borders

Elevation reads via material, translucency and a soft shadow — not a 1px outline on
everything. Two or three layers maximum: content, floating controls, modal. If everything is
elevated, nothing is.

### 15. Use the platform

`<button>`, `<a>`, `<dialog>`, `<details>`, `<input type="search">`, `<label>`, `popover`.
Native elements come with focus management, keyboard handling, screen-reader semantics and
platform behaviour for free, and they will outlive your custom version. A `<div onclick>` is
a defect.

---

## Pre-flight checklist

Run this before saying a build is done. Anything you could not verify, say so.

- [ ] Body text ≥ 4.5:1, large text ≥ 3:1, **in both themes**
- [ ] Every interactive element is keyboard-reachable, in visual order, with a visible focus ring
- [ ] Touch targets ≥ 44×44 CSS px; pointer targets ≥ 24×24 with spacing
- [ ] Nothing is communicated by colour alone
- [ ] Every image has an `alt` (empty `alt=""` if decorative); every icon-only button has a label
- [ ] `prefers-reduced-motion: reduce` removes transforms, parallax, autoplay and long transitions
- [ ] Layout holds at 320px wide and at 200% browser zoom with no horizontal scroll
- [ ] Light and dark both look deliberate — no unstyled white flashes, no washed-out greys
- [ ] Type sizes and spacing all come from the scale; no orphan values
- [ ] Forms: real `<label>`s, inline errors tied by `aria-describedby`, correct `inputmode`/`autocomplete`
- [ ] Focus is trapped in modals and returns to the trigger on close
- [ ] The Back button does what the user expects
