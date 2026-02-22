# ImageKit Transformations, Responsive Behavior, Performance, and Cost

## Purpose

Standardize transformation usage for quality, performance, and predictable costs.

## Transformation Strategy

1. Define stable transform profiles per surface (hero, logos, cards, thumbnails).
2. Avoid ad-hoc one-off transforms in production markup when reusable profiles suffice.
3. Prefer explicit transformation arrays over implicit URL guessing.

## Responsive Defaults

1. Keep `responsive` enabled by default in `@imagekit/next` image components.
2. Disable only for strict deterministic transform control or policy restrictions.
3. Validate responsive output for key widths: `360`, `375`, `390`, tablet, desktop.

## Quality and Format Defaults

1. Start with balanced quality settings (avoid overly aggressive compression).
2. Tune by visual acceptance and payload targets per surface type.
3. Keep transformation complexity proportional to user-visible value.

## Overlay and AI Transform Governance

1. Use overlays/AI transforms only with explicit product/design intent.
2. Require review for any transformation that changes semantic content.
3. Avoid stacking heavy AI transforms on hot path assets unless justified.

## Cost Controls

1. Control transformation cardinality by limiting arbitrary dimension permutations.
2. Reuse transform definitions across components when visual intent is shared.
3. Document cost-impact for new transformation families in PR notes.

## Performance Controls

1. Avoid redundant optimization layers that duplicate transform work.
2. Keep LCP media transform choices conservative and tested.
3. For videos, use poster thumbnails and avoid unnecessary eager preload.

## Practical Rules

1. Use eager loading sparingly for above-the-fold critical media only.
2. Use lazy loading for below-the-fold assets.
3. Validate transformation output against REMY parity expectations.

## Cross-References

- `docs/imagekit/02-remy-implementation-playbook.md`
- `docs/imagekit/05-operations-runbook.md`
- `docs/process/imagekit-change-checklist.md`
