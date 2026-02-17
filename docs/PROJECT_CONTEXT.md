# Project Context

## What This Repo Contains

This repository intentionally stores two separate web design systems:

1. `REMY`: the active WithRemy-based site used as the default project experience.
2. `SAAS-BLUE`: a legacy/archived SaaS-blue variant kept for reference and reuse.

## Active Default

- Default entry (`/`) forwards to `REMY` (`/wireframe-remy.html`).
- `SAAS-BLUE` stays directly accessible at `/designs/saas-blue-theme/index.html`.

## Where To Edit

### If request says `REMY`
- Markup: `wireframe-remy.html`
- Style: `wireframe-remy.css`
- Behavior: `wireframe-remy.js`
- Tokens/base design system: `design-system/withremy/withremy.css`

### If request says `SAAS-BLUE`
- Markup: `designs/saas-blue-theme/index.html`
- Style: `designs/saas-blue-theme/styles.css`
- Behavior: `designs/saas-blue-theme/script.js`

## Governance Rules

1. Always use system alias + component ID when discussing button/CTA work.
2. Use `docs/design-language-map.md` as the canonical button/asset naming contract.
3. Use `docs/design-registry.json` for machine-readable system routing and ownership.
4. Do not cross-import design tokens, class families, or component markup between `REMY` and `SAAS-BLUE`.
5. Keep asset names prefix-scoped to their system (`remy-` or `saas-blue-`).
