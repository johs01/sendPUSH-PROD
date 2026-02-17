# Design Language Map

This repository has two distinct design systems. Use only the aliases below when requesting UI changes.

## System Ownership

| Alias | Role | Route | Canonical Files |
| --- | --- | --- | --- |
| `REMY` | Active default design system (WithRemy) | `/wireframe-remy.html` (root `/` forwards here) | `wireframe-remy.html`, `wireframe-remy.css`, `wireframe-remy.js`, `design-system/withremy/withremy.css` |
| `SAAS-BLUE` | Archived/legacy SaaS-blue system | `/designs/saas-blue-theme/index.html` | `designs/saas-blue-theme/index.html`, `designs/saas-blue-theme/styles.css`, `designs/saas-blue-theme/script.js` |

## Conversation Rule (Mandatory)

Always reference UI requests with:

`<SYSTEM>.<SURFACE>.<ROLE>`

Example: `REMY.EMAIL_CTA.HERO`

Do not ask for "the yellow button" or "that CTA" without a system alias and ID.

## Button/CTA ID Matrix

| ID | Label | Selector | Source File |
| --- | --- | --- | --- |
| `REMY.NAV.START_FREE` | Start Free | `.wf-header .wr-cta-join.wf-btn--small` | `wireframe-remy.html` |
| `REMY.EMAIL_CTA.HERO` | Start Free in 2 Minutes | `#hero .wf-email-cta__button` | `wireframe-remy.html` |
| `REMY.EMAIL_CTA.TESTIMONIAL` | Start Free Trial | `[aria-label="Start Free Trial email capture"] .wf-email-cta__button` | `wireframe-remy.html` |
| `REMY.EMAIL_CTA.PROCESS` | Start in Under 10 Minutes | `[aria-label="Start in Under 10 Minutes email capture"] .wf-email-cta__button` | `wireframe-remy.html` |
| `REMY.EMAIL_CTA.FINAL` | Get Your First Campaign Ready | `#final-cta .wf-email-cta__button` | `wireframe-remy.html` |
| `REMY.PRICING.STARTER` | Get Started with Starter | `#pricing .wf-pricing-card:nth-of-type(1) .wf-pricing-card-cta` | `wireframe-remy.html` |
| `REMY.PRICING.PRO` | Upgrade to Pro | `#pricing .wf-pricing-card-cta.wf-pricing-card-cta--pro` | `wireframe-remy.html` |
| `REMY.PRICING.ENTERPRISE` | Talk to Sales | `#pricing .wf-pricing-card:nth-of-type(3) .wf-pricing-card-cta` | `wireframe-remy.html` |
| `REMY.TENANT_TRIAL.SUBMIT` | Start 30-Day Trial | `#wf-tenant-trial-form .wf-tenant-submit` | `wireframe-remy.html` |
| `SAAS-BLUE.NAV.BOOK_DEMO` | Book Demo | `.site-header .nav-actions .btn.btn-ghost` | `designs/saas-blue-theme/index.html` |
| `SAAS-BLUE.NAV.START_FREE` | Start Free | `.site-header .nav-actions .btn.btn-cta` | `designs/saas-blue-theme/index.html` |
| `SAAS-BLUE.HERO.START_TRIAL` | Start Free 14-Day Trial | `#top .hero-actions .btn.btn-primary` | `designs/saas-blue-theme/index.html` |
| `SAAS-BLUE.HERO.WALKTHROUGH` | See Product Walkthrough | `#top .hero-actions .btn.btn-secondary` | `designs/saas-blue-theme/index.html` |
| `SAAS-BLUE.FINAL_CTA.START_TRIAL` | Start Free 14-Day Trial | `#cta .final-cta .btn.btn-cta` | `designs/saas-blue-theme/index.html` |
| `SAAS-BLUE.FINAL_CTA.BOOK_DEMO` | Book Live Demo | `#cta .final-cta .btn.btn-primary` | `designs/saas-blue-theme/index.html` |

## Asset Naming Rules

### REMY
- Asset folder: `assets/remy/`
- Filename prefix: `remy-`
- Pattern: `remy-<surface>-<purpose>.<ext>`

### SAAS-BLUE
- Asset folder: `assets/saas-blue-theme/`
- Filename prefix: `saas-blue-`
- Pattern: `saas-blue-<surface>-<purpose>.<ext>`

### Shared Rule
- Do not move assets between systems without renaming to the destination prefix.
- Do not import one system's CSS tokens/components into the other system.
