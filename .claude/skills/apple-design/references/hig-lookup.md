# Reference routing table

Two reference sets. Check `web/` first — it carries the CSS values and web-specific rules.
Drop to `hig/` for the original Apple wording, for citation, or for topics with no web file.

Load 3–6 files for a typical task. Never load the whole corpus.

## Always

| Task | Load |
|------|------|
| Anything at all | `web/design-rules.md` |
| Any review | + `web/accessibility.md`, `web/color.md`, `web/typography.md`, `web/spacing-layout.md` |

## Foundations

| Topic | Web layer | HIG source |
|-------|-----------|------------|
| Type scale, fonts, weights, tracking, line length | `web/typography.md` | `hig/typography.md` |
| Spacing, grid, margins, containers, corner radii | `web/spacing-layout.md` | `hig/layout.md` |
| Colour, semantic tokens, palette, contrast | `web/color.md` | `hig/color.md` |
| Dark mode, elevation, theme switching | `web/dark-mode.md` | `hig/dark-mode.md` |
| Accessibility, contrast, targets, focus, ARIA | `web/accessibility.md` | `hig/accessibility.md`, `hig/inclusion.md` |
| Motion, easing, duration, scroll, hover, press | `web/motion-interactions.md` | `hig/motion.md`, `hig/gestures.md`, `hig/pointing-devices.md` |
| Blur, translucency, vibrancy, Liquid Glass | `web/materials.md` | `hig/materials.md`, `hig/liquid-glass.md` |
| Ready-made CSS custom properties | `web/tokens.css` | — |

## UI patterns

| Topic | Web layer | HIG source |
|-------|-----------|------------|
| Navigation, sidebars, tabs, breadcrumbs | `web/patterns.md` | `hig/layout.md` |
| Modals, sheets, dialogs, popovers, confirmation | `web/patterns.md` | `hig/modality.md` |
| Forms, inputs, validation, keyboards | `web/patterns.md` | `hig/entering-data.md`, `hig/keyboards.md` |
| Loading, skeletons, progress, empty states | `web/patterns.md` | `hig/loading.md`, `hig/feedback.md` |
| Errors, toasts, alerts, undo | `web/patterns.md` | `hig/feedback.md`, `hig/undo-and-redo.md` |
| Search | `web/patterns.md` | `hig/searching.md` |
| Buttons, controls, selection, focus rings | `web/patterns.md` | `hig/focus-and-selection.md` |
| Settings and preferences | `web/patterns.md` | `hig/settings.md` |
| Icons and iconography | `web/patterns.md` | `hig/icons.md`, `hig/sf-symbols.md` |
| Images, art direction, aspect ratios | `web/patterns.md` | `hig/images.md` |
| Drag and drop | — | `hig/drag-and-drop.md` |

## HIG-only topics

No web layer — read the HIG file directly and translate as you go.

| Topic | File |
|-------|------|
| UI copy, tone, labels, capitalisation | `hig/writing.md` |
| Onboarding and first run | `hig/onboarding.md`, `hig/launching.md` |
| Charts and data visualisation | `hig/charting-data.md` |
| Accounts, sign-in, auth | `hig/managing-accounts.md` |
| Notifications and permission prompts | `hig/managing-notifications.md` |
| Privacy and permission requests | `hig/privacy.md` |
| AI and ML features | `hig/generative-ai.md`, `hig/machine-learning.md` |
| Right-to-left languages | `hig/right-to-left.md` |
| Inclusive design and imagery | `hig/inclusion.md` |
| Help and documentation | `hig/offering-help.md` |
| Sharing and collaboration | `hig/collaboration-and-sharing.md` |
| Ratings and review prompts | `hig/ratings-and-reviews.md` |
| Branding and logo use | `hig/branding.md` |
| App icons / favicons / PWA icons | `hig/app-icons.md` |
| Audio and video playback | `hig/playing-audio.md`, `hig/playing-video.md` |
| Fullscreen | `hig/going-full-screen.md` |
| Maps and location | `hig/maps.md` |
| Payments | `hig/apple-pay.md`, `hig/in-app-purchase.md` |
| Printing and print stylesheets | `hig/printing.md` |
| File upload and download | `hig/file-management.md` |

## Low web relevance

Present for completeness; rarely useful for a website or web app:
`augmented-reality.md`, `game-controls.md`, `apple-pencil-and-scribble.md`,
`playing-haptics.md`, `multitasking.md`, `live-viewing-apps.md`.
