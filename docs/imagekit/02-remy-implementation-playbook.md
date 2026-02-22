# REMY ImageKit Implementation Playbook

## Purpose

Provide practical implementation guidance for moving REMY image references to ImageKit safely.

## Current State

1. Canonical REMY markup currently references local files under `assets/remy/*`.
2. This pass is docs/contracts only; runtime migration occurs in a separate implementation phase.

## Migration Workflow (When Runtime Migration Starts)

1. Upload source image to ImageKit Media Library.
2. Decide foldering and naming convention for the asset path.
3. Define required transformations (width/height/crop/quality/format) for each surface.
4. Replace local URL references in canonical REMY files with ImageKit-backed usage.
5. Verify responsive layout, accessibility, and parity.

## REMY Surface Patterns

### Hero Media

1. Use predictable transform profiles for desktop/tablet/mobile widths.
2. Keep LCP-critical images optimized and avoid unnecessary chained transforms.

### Logo Grid

1. Normalize logo visual size with transform dimensions.
2. Preserve brand clarity while controlling payload.

### Cards and Testimonial Media

1. Use consistent dimension families for card contexts.
2. Avoid per-item one-off transformations unless necessary.

## SDK Usage Guidance

1. Prefer `ImageKitProvider` at layout/root scope for default `urlEndpoint`.
2. Use `Image` for images and `Video` for video assets.
3. Use `transformation` prop for explicit transform intent.
4. Use `queryParameters` only for non-transform metadata/versioning concerns.

## Responsive Guidance

1. Keep `responsive=true` as default.
2. Use `responsive=false` when unnamed transform restrictions or strict transform control requires deterministic URLs.
3. Validate output at `360`, `375`, `390`, tablet, desktop.

## Loading Policy

1. Above-the-fold/LCP media: `loading="eager"` when needed.
2. Below-the-fold media: `loading="lazy"`.
3. Use placeholder strategy only when it does not degrade SSR UX.

## Checklist Before URL Swap PRs

1. Confirm alt text completeness.
2. Confirm transformed output remains visually consistent with REMY design.
3. Confirm no horizontal overflow or clipping regressions.
4. Include rollback note with prior asset references.

## Cross-References

- `docs/imagekit/04-transformations-responsive-performance-and-cost.md`
- `docs/imagekit/05-operations-runbook.md`
- `docs/process/imagekit-change-checklist.md`
