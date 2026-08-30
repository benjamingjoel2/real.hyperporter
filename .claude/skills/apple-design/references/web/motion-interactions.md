# Motion and interaction

> HIG source: `../hig/motion.md`, `../hig/gestures.md`, `../hig/pointing-devices.md`,
> `../hig/focus-and-selection.md`, `../hig/feedback.md`

## The test

> **HIG — Motion**: "Add motion purposefully… Don't add motion for the sake of adding motion.
> Gratuitous or excessive animation can distract people and may make them feel disconnected or
> physically uncomfortable."

Every animation answers one of two questions: *where did that come from?* or *did that work?*
If it answers neither, delete it.

Corollary from the HIG that gets ignored most: **avoid adding motion to interactions that
happen frequently.** A 400ms flourish is charming once and infuriating on the fortieth click.

## Duration

| What | Duration |
|------|----------|
| Hover, press, focus ring | 100–150ms |
| Small state change (toggle, checkbox, chip) | 150–200ms |
| Popover, menu, tooltip in/out | 200–250ms |
| Modal, sheet, drawer | 300–400ms |
| Page / route transition | 300–500ms |
| Anything else | Probably too long |

Exits run faster than entrances — roughly 2/3 the duration. Leaving should feel immediate;
arriving can take a moment to explain itself.

## Easing

```css
--ease-out:      cubic-bezier(0.16, 1, 0.3, 1);     /* entering, expanding */
--ease-in:       cubic-bezier(0.7, 0, 0.84, 0);     /* exiting, collapsing */
--ease-in-out:   cubic-bezier(0.65, 0, 0.35, 1);    /* moving between two states */
--ease-standard: cubic-bezier(0.32, 0.72, 0, 1);    /* the iOS sheet curve */
--ease-spring:   linear(0, 0.006, 0.025, 0.101, 0.539, 0.826, 0.962, 1.023,
                        1.04, 1.032, 1.013, 0.999, 0.994, 1);
```

`--ease-standard` is the workhorse: a fast start that settles gently, which is most of what
makes Apple motion feel Apple. **Never `linear`** on anything spatial — nothing in the physical
world starts and stops at constant velocity. Linear is only for continuous loops (spinners,
marquees) and for opacity.

For a genuine spring, CSS `linear()` approximates one without JavaScript.

## Animate cheap properties

`transform` and `opacity` only. `width`, `height`, `top`, `left`, `margin` and `box-shadow`
force layout or paint and will drop frames on a mid-range phone.

- Growing a card → `transform: scale()`
- Sliding a drawer → `transform: translateX()`
- Height that must animate → `grid-template-rows: 0fr → 1fr`, or `interpolate-size:
  allow-keywords` where supported
- Shadow that must animate → cross-fade a pseudo-element carrying the larger shadow

## States

Every interactive element has five, and all five are your job:

```css
.btn                  { transition: background-color 150ms var(--ease-out),
                                    transform 100ms var(--ease-out); }
.btn:hover            { background: var(--accent-hover); }
.btn:active           { transform: scale(0.97); background: var(--accent-pressed); }
.btn:focus-visible    { outline: 2px solid var(--accent); outline-offset: 2px; }
.btn:disabled         { opacity: 0.4; cursor: not-allowed; }
```

- **Press feedback matters more than hover** — hover doesn't exist on touch. A 2–3% scale-down
  on `:active` is the whole trick; it makes a web button feel physical.
- Guard hover for pointer devices: `@media (hover: hover) and (pointer: fine)`.
- Disabled elements must still be discoverable — prefer keeping a button enabled and
  explaining why the action fails to hiding the path entirely.
- Never remove a focus ring without an equally visible replacement.

## Pointer, touch, keyboard

- Cursor tells the truth: `pointer` for links and buttons, `text` for text, `grab`/`grabbing`
  for draggables, `not-allowed` for disabled. Never `pointer` on non-interactive text.
- Don't hijack scroll. No scrolljacking, no custom smooth-scroll libraries, no
  `overscroll-behavior` games outside of genuinely scoped containers.
- `scroll-behavior: smooth` on the root for in-page anchors, disabled under reduced motion.
- `scroll-margin-top` on anchor targets so a sticky header doesn't cover them.
- Gestures need a visible alternative. Swipe-to-delete needs a button too.
- Don't block browser gestures: pinch-zoom, edge-swipe back, text selection, right-click.
- Long-press and hover-intent are enhancements, never the only route.

## Loading and progress

- **< 1s** — no indicator; a spinner that flashes is worse than nothing.
- **1–3s** — inline spinner or shimmer, in place, where the content will land.
- **> 3s** — determinate progress with a real estimate, and something to cancel it.
- Prefer skeletons that match the final layout — they hold the space and stop layout shift.
- Optimistic UI where the action almost always succeeds; roll back visibly and explain if not.
- Never a full-page spinner for a partial update.

## Transitions between views

- `view-transition-name` and the View Transitions API give native-feeling route changes with
  no library; wrap in `@supports` and gate on `prefers-reduced-motion`.
- Continuity matters: the element that was clicked should be the element that grows into the
  next view. An unrelated cross-fade teaches the user nothing.
- Never block input while a transition runs. The HIG: "don't make people wait for an animation
  to complete before they can do anything."

## Reduced motion

Non-negotiable — see the kill switch in `accessibility.md`. Beyond the blanket rule, replace
movement with a cross-fade rather than removing feedback entirely; the user still needs to
know something happened.
