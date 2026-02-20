# Archived Next Component Layer

## Status

`/Users/johs777/Documents/New project/components` is archived reference, not active runtime.

## Why Archived

1. Active REMY runtime is source-mirrored from canonical static files.
2. The archived layer uses a separate token namespace (`--color-*`, `--space-*`, etc.) not used by canonical REMY runtime.
3. Continuing parallel edits there creates maintenance ambiguity and parity risk.

## Rules

1. Do not use `/components` for live parity fixes.
2. Do not treat `/components` as source of truth for routes, selectors, or theming.
3. Any reactivation requires explicit migration ADR approval.

## Reactivation Conditions

All must be satisfied before reactivating:

1. Approved migration ADR with section-by-section cutover plan.
2. Token namespace reconciliation strategy.
3. Interaction parity test suite passing at each cutover stage.
4. CI parity thresholds maintained for all required scenarios.
