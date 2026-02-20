# REMY DOM + Runtime Contracts

This document defines DOM contracts that `/Users/johs777/Documents/New project/wireframe-remy.js` depends on.

## Runtime Source

- Script source: `/Users/johs777/Documents/New project/wireframe-remy.js`
- Canonical markup: `/Users/johs777/Documents/New project/wireframe-remy.html`

Any selector/ID/data-attribute change below is a potential breaking change.

## Required Theme Contracts

1. Theme storage key: `wf-theme-mode` (`light|dark`).
2. Theme root attributes:
- `data-theme-mode`
- `data-theme`
3. Required toggle IDs:
- `#wfThemeToggle`
- `#wfMobileThemeToggle`
4. Live region:
- `#wfThemeLive`

## Required Navigation Contracts

1. Sticky nav root:
- `#wfNav`
2. Desktop links container:
- `.wf-nav-links a[href^='#']`
3. Mobile menu toggle:
- `#wfMobileMenuToggle`
4. Mobile menu root:
- `#wfMobileMenu`
5. Mobile links container:
- `.wf-mobile-menu-links a[href^='#']`
6. Menu close surfaces:
- `[data-mobile-menu-close]`

## Required Reveal Contracts

1. Reveal items:
- `.reveal`
2. Optional stagger attribute:
- `data-reveal-order`
3. Runtime delay token:
- `--reveal-delay` (set per element by JS)

## Required Pricing Contracts

1. Pricing section:
- `#pricing`
2. Billing toggle buttons:
- `[data-pricing-toggle='monthly']`
- `[data-pricing-toggle='yearly']`
3. Animated price stacks:
- `[data-pricing-stack='starter']`
- `[data-pricing-stack='pro']`
4. Billing label targets:
- `.wf-pricing-billed-label`

## Required Tenant Trial Contracts

1. Form root:
- `#wf-tenant-trial-form`
2. Required fields:
- `#wf-tenant-name`
- `#wf-tenant-business`
- `#wf-tenant-email`
- `#wf-tenant-location`
3. Optional website field:
- `#wf-tenant-website`
4. Website help text:
- `#wf-tenant-website-help`
5. Success feedback node:
- `#wf-tenant-form-success`

## Breaking Change Checklist (Mandatory)

Before renaming/removing any contracted selector:

1. Update `wireframe-remy.js` in the same PR.
2. Update this contract document in the same PR.
3. Run `npm run check:selector-contracts`.
4. Run `npm run parity:check` against the full matrix.
5. Attach parity report snippet and screenshots in PR.
