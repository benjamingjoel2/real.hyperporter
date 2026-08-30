# Apple Design

A reusable Claude Code skill for designing and building **websites and web apps** to Apple's
Human Interface Guidelines.

## Use it

Ask for it by name, or just describe the work:

- `/apple-design`
- "Design this landing page with Apple's design principles"
- "Review this dashboard against Apple HIG"
- "Build me an Apple-style design token system with dark mode"
- "Audit this form for accessibility"
- "Add Liquid Glass to the sticky header"

## What's inside

```
apple-design/
├── SKILL.md                       Build mode, review mode, HIG→web vocabulary
└── references/
    ├── hig-lookup.md              Topic → file routing
    ├── web/                       The web translation layer — real CSS values
    │   ├── design-rules.md        The fifteen rules + pre-flight checklist
    │   ├── typography.md          Scale, system font stacks, tracking, measure
    │   ├── spacing-layout.md      4px grid, containers, radii, control sizing
    │   ├── color.md               Token architecture, full system palette, contrast
    │   ├── dark-mode.md           Elevation model, theme switching, images
    │   ├── accessibility.md       Contrast, targets, keyboard, ARIA, reduced motion
    │   ├── motion-interactions.md Durations, easings, states, loading
    │   ├── materials.md           Blur, vibrancy, Liquid Glass, scroll edge
    │   ├── patterns.md            Nav, forms, modals, search, lists, icons, images
    │   └── tokens.css             Drop-in custom properties for all of the above
    └── hig/                       53 Apple HIG documents, verbatim
```

The skill loads 3–6 files per task, not the whole corpus.

## Design intent

It takes the *principles* — deference, clarity, depth — not iOS chrome. It will not put a fake
status bar or a bottom tab bar on your website. Where a project already has its own design
system, that system wins; the HIG principles get applied inside it.

## Credits

Guidelines derived from [Apple's Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/).
The `references/hig/` corpus is adapted from [dickwu/apple-design-skill](https://github.com/dickwu/apple-design-skill).
The `references/web/` layer was written for this skill.
