# UI patterns

> HIG source: `../hig/modality.md`, `../hig/entering-data.md`, `../hig/keyboards.md`,
> `../hig/searching.md`, `../hig/loading.md`, `../hig/feedback.md`, `../hig/settings.md`,
> `../hig/icons.md`, `../hig/images.md`, `../hig/undo-and-redo.md`, `../hig/focus-and-selection.md`

## Navigation

The web's navigation model is the URL and the Back button. Everything else is layered on top,
and nothing may break those two.

- **Marketing site** — top bar, 5–7 items maximum, logo leading, one CTA trailing. Sticky with
  a scroll edge effect (`materials.md`), not a solid slab.
- **App / dashboard** — persistent left sidebar with sections; collapses to a drawer below
  1024px. Sidebar sections get a small uppercase label, not a heavy divider.
- **Deep hierarchies** — breadcrumbs. Users need to know where they are, not just where they
  can go.
- **Mobile web** — a bottom tab bar is an *installed-PWA* pattern. On a page in a browser it
  collides with the browser's own chrome and the home indicator. Prefer a top bar with a
  drawer, unless the app is display-mode standalone.

Rules:

- Current location is visibly marked, and not by colour alone — weight, a fill, or an
  indicator bar.
- Every route has a real URL. Back, forward, refresh and share all work. Modal state that
  should survive a reload belongs in the URL too.
- Never more than two levels of primary nav. A third means the information architecture is
  wrong.
- Hamburger menus on desktop hide navigation for no benefit. If it fits, show it.

## Buttons and controls

Four tiers, and a page uses at most one of the first:

| Tier | Style | Use |
|------|-------|-----|
| Primary | Filled `--accent`, white label | The one action this screen is for |
| Secondary | Tinted `--accent-subtle` or bordered | Common alternatives |
| Tertiary | Text only, accent coloured | Low-emphasis, inline |
| Destructive | Filled or text in red | Delete, remove, revoke |

- **One primary per view.** Two primaries means neither is primary.
- Label the verb: "Save changes", "Create project", "Delete 4 files". Not "OK", "Submit", "Yes".
- Sentence case.
- Destructive actions never sit adjacent to the safe default. Put space between them, and make
  the safe option the one focus lands on.
- Loading state replaces the label with a spinner *and keeps the button's width* — no reflow.
- Toggle switches for instant settings; checkboxes for a set that is saved together. A switch
  that needs a Save button is the wrong control.
- Segmented controls for 2–5 mutually exclusive views. Above 5, use a dropdown.

## Forms

> **HIG — Entering data**: minimise typing. Every field you can pre-fill, infer or remove is
> a field the user doesn't have to think about.

- **Labels above fields, always visible.** Placeholder-as-label disappears the moment typing
  starts, fails contrast, and breaks screen readers. Use `<label for>` — never a bare `<div>`.
- Placeholders show *format*, not the label: "you@example.com".
- One column. Multi-column forms get filled in the wrong order.
- Group related fields; a 20-field form becomes four sections of five.
- Mark **optional** fields, not required ones, when most are required.
- Right input type and hints — they change the mobile keyboard and enable autofill:
  ```html
  <input type="email" inputmode="email" autocomplete="email" spellcheck="false">
  <input type="tel"   inputmode="tel"   autocomplete="tel">
  <input type="text"  inputmode="numeric" autocomplete="one-time-code">
  ```
  `autocomplete` on address, name, and payment fields saves more user time than any other
  single thing you can do to a form.
- Input font-size ≥ 16px on mobile, or iOS Safari zooms on focus.
- **Validate on blur, not on keystroke.** Erroring while someone is still typing their email
  is hostile. Re-validate live only after a field has already errored once.
- Errors sit next to the field, name the fix, and are tied by `aria-describedby`. A summary at
  the top of the form links to each failing field.
- Never disable the submit button to enforce validation — the user has no idea what's missing.
  Let them submit and tell them.
- Preserve input on failure. Losing a filled form to a server error is unforgivable.

## Modality

> **HIG — Modality**: modality interrupts. Use it when the task genuinely needs full attention,
> or when losing data is a risk. Otherwise, don't.

| Pattern | Use |
|---------|-----|
| **Alert / confirm** | Destructive or irreversible. Two buttons. Name the verb. |
| **Sheet** (bottom on mobile, centred on desktop) | A self-contained subtask: compose, edit, filter |
| **Popover** | Contextual options anchored to a trigger. Non-modal — clicking outside dismisses |
| **Inline expansion** | Almost always better than any of the above |
| **New page** | Anything long enough to need scrolling, or worth a URL |

Requirements for anything modal:

- Native `<dialog>` with `showModal()`. It gives focus trapping, Escape, inert background and
  the top layer for free.
- Focus moves in on open, returns to the trigger on close.
- Escape closes. Backdrop click closes non-destructive dialogs; not ones with unsaved input.
- Warn before discarding unsaved work.
- One modal at a time. A modal opening a modal means the flow is wrong.
- Never a modal on page load. Cookie banners and newsletter popups are the most-hated pattern
  on the web for a reason.

## Search

- Prominent when search is the main way people navigate; behind an icon when it's secondary.
- `<input type="search">` with a leading magnifier and a clear (×) button.
- `Cmd/Ctrl+K` for a command palette in app UIs — now a firm convention.
- Show results as you type where results are cheap; debounce ~200ms.
- Suggest, correct and scope: recent searches, categories, "did you mean".
- **Zero results is a designed state**: what was searched, why nothing matched, and something
  to do next. Never a blank panel.

## Loading, feedback and empty states

- Loading rules live in `motion-interactions.md`.
- **Skeletons over spinners** for content that has a known shape. Match the real layout so
  nothing shifts when it lands.
- Reserve space for images with `width`/`height` or `aspect-ratio`. Layout shift is a defect.
- Success feedback is quiet — a brief inline confirmation, not a modal. If it's obvious it
  worked, say nothing at all.
- Errors: what happened, in plain language; why, if useful; what to do next. No codes as the
  only message, no "An error occurred", no blaming the user.
- **Toasts**: bottom or top-trailing, 4–6s, dismissible, one at a time, never for anything the
  user must act on. Anything requiring action is not a toast.
- **Undo beats confirm.** Prefer "Deleted. Undo" over "Are you sure?" for anything reversible.
  Keep the undo affordance available for a real interval, not 2 seconds.
- **Empty states** do work: explain what goes here, and give the button that creates the first
  one. An empty list with no explanation reads as broken.

## Lists and tables

- Row height ≥ 44px on touch.
- Zebra striping is rarely needed; separators inset to align with content are cleaner.
- Right-align numbers; use `tabular-nums`.
- Sticky header on long tables.
- Row actions appear on hover *and* have a keyboard/touch path — hover-only actions are
  unreachable on touch.
- Long lists get pagination or virtualisation, plus a stated total.
- Selection is visible without colour alone: a checkbox plus a tinted row.

## Icons

- One set, one optical weight, matched to the text weight beside it. Mixing outline and filled
  from different families is the fastest way to look unfinished.
- Sizes on the 4px grid: 16, 20, 24, 28, 32.
- Align to the text baseline, not the box; optical centring beats mathematical centring.
- SVG with `currentColor` so icons follow the theme.
- Decorative icons get `aria-hidden="true"`; icon-only buttons get an accessible name.
- An icon alone rarely communicates an action. Pair with a label wherever space allows —
  hamburger, kebab and share glyphs are the only ones most users read reliably.

## Images

- `alt` on every image; `alt=""` for decorative.
- `aspect-ratio` set to prevent shift; `object-fit: cover` with a sensible `object-position`.
- `loading="lazy"` below the fold, `fetchpriority="high"` on the LCP image, never lazy on it.
- Modern formats with fallbacks; responsive `srcset`/`sizes`.
- Art-direct rather than crop: a 16:9 hero cropped to 1:1 on mobile usually loses the subject.
  Use `<picture>` with different sources.
- Under dark mode, soften images with white backgrounds (`dark-mode.md`).

## Settings

- Group by task, not by data model.
- Sensible defaults; most users never open settings.
- Instant apply for reversible toggles; explicit Save only when a set must commit together.
- Explain what a setting does under it, not in a tooltip.
- Destructive account actions live at the bottom, visually separated, and confirm by typing.
