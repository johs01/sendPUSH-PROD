# REMY Source-Mirror Architecture Authority

## Purpose

Define the canonical runtime architecture so multiple developers can ship changes without parity drift.

## Current Architecture

1. Next app route `/` serves REMY page via body-source mirror.
2. Canonical HTML/CSS/JS remain in root source files.
3. Route handlers expose canonical CSS/JS files as stable assets consumed by Next runtime.

## Edit Workflow (Authoritative)

1. Make UI changes in:
- `/Users/johs777/Documents/New project/wireframe-remy.html`
- `/Users/johs777/Documents/New project/wireframe-remy.css`
- `/Users/johs777/Documents/New project/wireframe-remy.js`
- `/Users/johs777/Documents/New project/design-system/withremy/withremy.css`
2. Do not re-implement active REMY sections in `/Users/johs777/Documents/New project/components` for parity work.
3. Validate contracts:
- `npm run check:selector-contracts`
- `npm run check:token-integrity`
4. Validate visuals:
- `npm run parity:check`

## Rollback Flow

If a parity regression is introduced:

1. Revert the source-file change in canonical REMY files.
2. Re-run contract checks.
3. Re-run parity matrix and confirm report pass.

## Why This Is The Current Default

1. Provides strongest pixel parity against validated source files.
2. Avoids behavior drift from partial React re-implementations.
3. Keeps runtime deterministic while migration strategy is still in design phase.
