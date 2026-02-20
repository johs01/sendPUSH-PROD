# Project Context

## What This Repo Contains

This repository intentionally stores two separate web design systems:

1. `REMY`: active, production-facing system.
2. `SAAS-BLUE`: archived legacy system for reference only.

## Runtime Authority (Canonical)

`REMY` is rendered by Next.js at route `/` using a source-mirror runtime:

1. `/Users/johs777/Documents/New project/app/page.tsx` injects the canonical REMY body markup.
2. `/Users/johs777/Documents/New project/app/remy/withremy.css/route.ts` serves token/base CSS from source.
3. `/Users/johs777/Documents/New project/app/remy/wireframe-remy.css/route.ts` serves REMY page CSS from source.
4. `/Users/johs777/Documents/New project/app/remy/wireframe-remy.js/route.ts` serves REMY runtime JS from source.

Canonical source files to edit for live UI behavior:

- Markup: `/Users/johs777/Documents/New project/wireframe-remy.html`
- Style: `/Users/johs777/Documents/New project/wireframe-remy.css`
- Behavior: `/Users/johs777/Documents/New project/wireframe-remy.js`
- Base tokens/system layer: `/Users/johs777/Documents/New project/design-system/withremy/withremy.css`

## SAAS-BLUE (Archived)

Legacy files remain available but are out of active scope:

- `/Users/johs777/Documents/New project/designs/saas-blue-theme/index.html`
- `/Users/johs777/Documents/New project/designs/saas-blue-theme/styles.css`
- `/Users/johs777/Documents/New project/designs/saas-blue-theme/script.js`

## Governance Rules

1. For active production work, edit canonical REMY source files only.
2. Treat `/Users/johs777/Documents/New project/components` as archived reference unless migration is explicitly approved.
3. Keep route and selector contracts stable unless contract docs are updated in the same change.
4. Use `/Users/johs777/Documents/New project/docs/design-language-map.md` as the naming/selector contract for UI requests.
5. Use `/Users/johs777/Documents/New project/docs/design-registry.json` as the machine-readable ownership contract.
6. Do not cross-import classes/tokens/markup between `REMY` and `SAAS-BLUE`.
7. First-load theme defaults to light when no stored preference is present.
