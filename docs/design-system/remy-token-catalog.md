# REMY Token Catalog (Canonical)

This file is the canonical token inventory for the active REMY system.

## Source of Truth

1. Base brand/layout tokens: `/Users/johs777/Documents/New project/design-system/withremy/withremy.css`
2. Runtime semantic/state tokens: `/Users/johs777/Documents/New project/wireframe-remy.css`

Do not define duplicate alias token trees in other active files.

## Ownership Rules

1. Edit `--wr-*` tokens in `withremy.css` only.
2. Edit `--wf-*` tokens in `wireframe-remy.css` only.
3. If a new token is added, update this file in the same change.
4. Any rename/removal of a token requires running `npm run check:token-integrity`.

## Base Tokens (`--wr-*`)

### Color / Surface
- `--wr-ink`
- `--wr-text-muted`
- `--wr-text-subtle`
- `--wr-white`
- `--wr-bg-peach`
- `--wr-bg-cyan`
- `--wr-bg-salmon`
- `--wr-bg-panel-gray`
- `--wr-bg-panel-light`
- `--wr-accent-orange`
- `--wr-accent-blue`
- `--wr-accent-yellow`
- `--wr-accent-yellow-soft`
- `--wr-tag-yellow`

### Radius
- `--wr-r-12`
- `--wr-r-16`
- `--wr-r-20`
- `--wr-r-30`
- `--wr-r-pill`
- `--wr-r-cta`

### Shadows
- `--wr-shadow-badge`
- `--wr-shadow-email`

## Runtime Semantic / State Tokens (`--wf-*`)

### Motion
- `--wf-motion-ease-gentle`
- `--wf-motion-ease-standard`
- `--wf-motion-fast`
- `--wf-motion-base`

### CTA + Text Contrast
- `--wf-cta-lift-hover`
- `--wf-cta-lift-active`
- `--wf-cta-conv-bg`
- `--wf-cta-conv-edge`
- `--wf-cta-conv-edge-size`
- `--wf-cta-conv-text`
- `--wf-cta-sheen-mid-alpha`
- `--wf-cta-sheen-opacity`
- `--wf-cta-sheen-hover-opacity`

### Dark Section Semantics
- `--wf-section-dark-bg`
- `--wf-on-dark`
- `--wf-on-dark-muted`
- `--wf-dark-card-bg`
- `--wf-dark-card-border`

### Section-Specific Surfaces
- `--wf-problem-card-bg`
- `--wf-problem-card-hover-bg`
- `--wf-problem-card-border`
- `--wf-problem-card-text`
- `--wf-pricing-pro-bg`
- `--wf-pricing-pro-shadow`
- `--wf-pricing-pro-before-display`
- `--wf-pricing-toggle-active-color`
- `--wf-faq-hover-bg`
- `--wf-feature-hover-bg`
- `--wf-cap-testimonial-hover-bg`
- `--wf-card-sheen-gradient`
- `--wf-step-badge-yellow-text`

### Tenant Trial Form
- `--wf-tenant-form-bg`
- `--wf-tenant-form-border`
- `--wf-tenant-form-shadow`
- `--wf-tenant-form-gloss`
- `--wf-tenant-form-gloss-opacity`
- `--wf-tenant-label-color`
- `--wf-tenant-help-color`
- `--wf-tenant-input-bg`
- `--wf-tenant-input-border`
- `--wf-tenant-input-hover-border`
- `--wf-tenant-input-color`
- `--wf-tenant-input-placeholder`
- `--wf-tenant-input-focus-bg`

### Footer
- `--wf-footer-shell-bg`
- `--wf-footer-shell-border`
- `--wf-footer-shell-shadow`
- `--wf-footer-shell-gloss`
- `--wf-footer-shell-gloss-opacity`
- `--wf-footer-copy-color`
- `--wf-footer-link-color`
- `--wf-footer-link-hover-color`
- `--wf-footer-contact-color`
- `--wf-footer-contact-icon`
- `--wf-footer-social-bg`
- `--wf-footer-social-border`
- `--wf-footer-social-color`
- `--wf-footer-bottom-border`
- `--wf-footer-meta-color`
- `--wf-footer-legal-color`

### Email CTA
- `--wf-email-shell-bg`
- `--wf-email-shell-border`
- `--wf-email-shell-shadow`
- `--wf-email-input-bg`
- `--wf-email-input-color`
- `--wf-email-input-placeholder`

### Nav / Header Liquid Glass
- `--wf-nav-shell-border`
- `--wf-nav-shell-shadow`
- `--wf-nav-filter-bg`
- `--wf-nav-overlay-bg`
- `--wf-nav-overlay-opacity`
- `--wf-nav-specular-shadow`
- `--wf-nav-after-bg`
- `--wf-nav-after-opacity`
- `--wf-nav-scrolled-shadow`
- `--wf-nav-scrolled-border`
- `--wf-nav-mx` (runtime pointer position)
- `--wf-nav-my` (runtime pointer position)

### Theme / Menu Controls
- `--wf-theme-toggle-border`
- `--wf-theme-toggle-bg`
- `--wf-theme-toggle-shadow`
- `--wf-theme-toggle-color`
- `--wf-theme-toggle-hover-border`
- `--wf-theme-toggle-hover-shadow`
- `--wf-menu-control-border`
- `--wf-menu-control-bg`
- `--wf-menu-control-shadow`
- `--wf-menu-control-color`
- `--wf-menu-control-hover-border`
- `--wf-menu-control-hover-shadow`

### Mobile Drawer
- `--wf-mobile-backdrop-bg`
- `--wf-mobile-panel-border`
- `--wf-mobile-panel-shadow`
- `--wf-mobile-panel-filter-bg`
- `--wf-mobile-panel-overlay-bg`
- `--wf-mobile-panel-overlay-opacity`
- `--wf-mobile-panel-specular-shadow`
- `--wf-mobile-link-border`
- `--wf-mobile-link-bg`
- `--wf-mobile-link-color`

### Runtime Animation Variables (set via JS or CSS at runtime)
- `--wf-hover-y`
- `--wf-parallax-y`

## Dark-Mode Override Matrix

### Mode Entry Points
1. `html[data-theme="dark"]`
2. `@media (prefers-color-scheme: dark) { html:not([data-theme]) { ... } }`

### Core Overrides
The following token families are overridden in dark mode:
1. `--wr-*` core palette values (`ink`, muted text, white, bg families, accents, shadows).
2. All dark-surface semantic families (`--wf-section-dark-*`, `--wf-on-dark*`).
3. All readability-sensitive surface tokens (`problem`, `pricing`, `faq`, `tenant`, `footer`, `email`, `nav`, `menu`, `mobile panel`).
4. CTA sheen variables (`--wf-cta-sheen-*`) tuned down in dark mode.

## Anti-Patterns (Do Not Do)

1. Do not redefine `--wr-*` tokens in section-scoped selectors.
2. Do not add component-local tokens in random modules for live REMY parity work.
3. Do not hardcode color literals in markup/inline styles for active REMY surfaces.
4. Do not create a parallel token namespace for the active runtime path.
