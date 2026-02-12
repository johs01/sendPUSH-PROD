# WithRemy LLM Design System

This is an LLM-first, deterministic design system extracted from the live site:

- Source URL: `https://www.withremy.com/`
- Capture date: `2026-02-12`
- Breakpoints: `desktop >= 1400`, `tablet 800-1399.98`, `mobile <= 799.98`
- Token file: `/Users/johs777/Documents/New project/design-system/withremy/tokens.json`
- Style primitives: `/Users/johs777/Documents/New project/design-system/withremy/withremy.css`

If you follow the rules below exactly, generated pages stay visually consistent with the original brand language.

## 1) Non-Negotiable Rules

1. Use only the tokenized colors, radii, shadows, and type ramps from `tokens.json`.
2. Use only two typefaces:
   - Display: `Rodger Bold`
   - Body/UI: `Onest`
3. Keep corner language rounded:
   - Pills: `100px`
   - Cards: `30/20/16/12` depending on breakpoint and component
4. Avoid adding borders except where explicitly defined.
5. Preserve playful accent chips:
   - Orange quote chips
   - Yellow floating tags
   - Slight rotations (`-9` to `+9` degrees)
6. Keep section rhythm and background alternation in the same family:
   - Peach, white, cyan, white, salmon, white, peach
7. Use fade-up motion (`opacity 0`, `translateY(150px)` -> visible) for major cards/blocks.

## 2) Visual DNA Summary

1. Big editorial display headings with tight tracking.
2. Soft warm/cool section blocks with large breathing room.
3. Pill-heavy UI language (chips, badges, CTA, process headers, input shell).
4. Minimal hard edges, almost no hard borders, very selective shadow usage.
5. Friendly, hand-placed feel via slight chip rotations and offset accents.

## 3) Wireframe -> Component Mapping

Use this mapping whenever converting a wireframe.

| Wireframe Element | WithRemy Component | Required Styling |
|---|---|---|
| Page hero title | `wr-h1` | Rodger, large display size by breakpoint |
| Section title | `wr-h2` | Rodger display-h2 ramp |
| Subsection heading | `wr-h3` | Rodger display-h3 ramp |
| Lead paragraph | `wr-text-lead` | muted text token |
| Standard body text | `wr-text-body` or `wr-text-body-lg` | Onest with tokenized line-height |
| Primary CTA | `wr-cta-join` | yellow-soft pill, bold centered label |
| Form input row | `wr-email-form` + `wr-email-input` + `wr-email-submit` | exact pill geometry and shadow |
| Emphasis quote | `wr-chip-quote` | orange pill chip, white text, rotation allowed |
| Tag/label | `wr-chip-yellow` | yellow chip with medium/semibold text |
| Main board container | `wr-card-board` | white rounded card |
| Gray board container | `wr-card-board wr-card-board--gray` | gray rounded card |
| Process card | `wr-card-process` + variant class | tinted background, rounded card |
| Process step header | `wr-pill-step` | white pill with number dot and bold title |
| Brand badge | `wr-badge-remy` | yellow pill + drop shadow (hidden on mobile) |
| Footer meta | `wr-text-meta` | subtle gray text |

## 4) Section Pattern Recipes

Use these as canonical layout archetypes. A wireframe can use any subset, but styling must follow these recipes.

1. Hero With Email Capture
   - Background: peach
   - Stack: H1 -> lead text -> email form
   - Add one yellow brand badge near hero illustration cluster
2. Problem Statement + Quote Cloud
   - White section
   - H2 + large gray rounded board
   - Place orange quote chips in staggered positions with slight rotations
3. Discovery/Collection Board
   - Cyan section
   - H2 + large white board card
   - Yellow tag chips on top of light panel inside board
4. Process Trio
   - White section
   - Three tinted cards (orange/blue/yellow)
   - Each card gets white step title pill and body copy
5. Split Story Section
   - Salmon section
   - Left text stack, right visual/media
6. Hiring/Team CTA
   - White section
   - Centered H2 + yellow-soft join button
7. Footer Capture
   - Peach section
   - Centered H1 + second email form + muted footer metadata

## 5) Responsive Behavior Contract

Read directly from `tokens.json`:

1. Desktop (`>=1400`)
   - Core content width: `1100`
   - Hero H1: `72/79.2`
   - Section paddings large (`120-140`)
2. Tablet (`800-1399.98`)
   - Core content width: `720`
   - Hero H1: `54/59.4`
   - Cards compress and process cards switch to row layout
3. Mobile (`<=799.98`)
   - Core content width: `360` (inner narrow `335`)
   - Hero H1: `40/44`
   - Quote text downsizes to `14`
   - Process cards return to stacked columns
   - Remy badge hidden

## 6) Pixel-Faithful Asset Rules

For highest visual match:

1. Reuse the exact image URLs listed in `tokens.json`.
2. Keep the same icon display sizes (`~70px desktop/tablet`, compressed on mobile where needed).
3. Preserve inline SVG accents (arrow scribbles and footer mark) instead of redrawing.
4. Use the exact font sources from `tokens.json`.

## 7) LLM Conversion Procedure

When an LLM receives a new wireframe:

1. Parse wireframe nodes into semantic roles:
   - section, heading, body, card, chip, form, CTA, image
2. Assign each node to the mapping table in Section 3.
3. Select section archetypes from Section 4.
4. Apply strict token values from `tokens.json` (no invented values).
5. Generate layout with breakpoint overrides from `tokens.json`.
6. Add motion only from this system:
   - fade-up
   - chip rotation
7. Run validation checklist before final output.

## 8) Validation Checklist (Must Pass)

1. Only approved colors are used.
2. Only approved typography ramps are used.
3. Only approved radii values are used.
4. Email form geometry matches token values by breakpoint.
5. Process card tint and structure are correct.
6. CTA/button pills match token values by breakpoint.
7. No sharp-corner UI introduced.
8. No unapproved shadows introduced.
9. Breakpoint switches occur at exact thresholds.
10. Layout remains in the WithRemy visual language at all widths.

## 9) Prompt Template For Any LLM

Use this prompt to convert a wireframe:

```text
You are implementing a page using the WithRemy design system.

Rules:
1) Read and obey tokens from: /Users/johs777/Documents/New project/design-system/withremy/tokens.json
2) Use component primitives from: /Users/johs777/Documents/New project/design-system/withremy/withremy.css
3) Do not invent new colors, radii, type ramps, or shadows.
4) Preserve breakpoint behavior: desktop >=1400, tablet 800-1399.98, mobile <=799.98.
5) Map wireframe nodes using the mapping table in WITHREMY_LLM_SYSTEM.md.
6) Output production-ready HTML/CSS (or framework code) that matches this visual language.

Validation:
- Include a short self-check confirming all 10 validation checklist items pass.
```

## 10) Practical Note

This package creates deterministic style parity. True 100% pixel-for-pixel parity with the live page also requires using the same media assets and SVG marks from the source.
