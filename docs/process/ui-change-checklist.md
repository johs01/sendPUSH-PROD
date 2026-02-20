# UI Change Checklist (REMY)

Use this checklist for any design-affecting REMY change.

## 1) Edit Location

1. Confirm change is made in canonical REMY source files.
2. Confirm no active runtime logic was edited in archived component layer.

## 2) Contract Safety

1. Run `npm run check:selector-contracts`.
2. Run `npm run check:token-integrity`.
3. If selectors/tokens changed, update corresponding docs in same PR.

## 3) Pixel Parity

1. Run full matrix: `npm run parity:check`.
2. Confirm no threshold failures in report.
3. Keep report snippet in PR description.

## 4) Theme and Responsive Spot Checks

1. Light mode top, sticky, and key CTA states.
2. Dark mode readability in hero/pricing/faq/form/footer.
3. Mobile widths: `360`, `375`, `390` with no horizontal overflow.

## 5) PR Requirements

1. List impacted sections.
2. List selector/token changes.
3. Include parity report summary.
4. Include desktop/tablet/mobile screenshots.
