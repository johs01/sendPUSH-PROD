# ADR-0001: Source-Mirror Runtime Today, Componentized Runtime Later

## Status
Accepted (staged migration backlog)

## Context

The production REMY UI currently achieves parity by mirroring canonical source files.
A parallel componentized layer exists but is not runtime-authoritative.

## Decision

1. Keep source-mirror runtime as the active model.
2. Treat componentized runtime as migration backlog only.
3. Do not migrate incrementally without explicit parity gates per section.

## Migration Stages (Future)

1. Stage 0: Freeze canonical contracts and token inventory.
2. Stage 1: Build one section in React with strict screenshot parity.
3. Stage 2: Migrate interaction-heavy sections only with behavior parity checks.
4. Stage 3: Replace source-mirror rendering only after full-matrix parity pass.

## Consequences

Positive:
- Stable pixel parity now.
- Lower near-term regression risk.

Tradeoffs:
- Duplicate architecture remains until migration is scheduled.
- Requires clear archive governance to prevent accidental drift.
