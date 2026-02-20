# Component Documentation Standard (REMY)

This folder defines the canonical format for documenting reusable UI components in this project.

## Current Runtime Note

The active REMY runtime is source-mirrored from canonical files and does not currently render from `/Users/johs777/Documents/New project/components`.

Treat component docs here as:
1. design-system baseline references, and
2. migration-ready specifications.

Do not use these docs as override authority for live parity fixes unless migration is explicitly approved.

## Files
- `_component-template.md`: Required template for all new component docs.
- `Button.md`: Production-faithful sample for an existing primitive.
- `Container.md`: Baseline documentation for layout width primitive.
- `Grid.md`: Baseline documentation for responsive column primitive.
- `Stack.md`: Baseline documentation for vertical rhythm primitive.
- `Modal.md`: Reference sample for a common dialog component pattern.

## Required Section Order
Use this exact order in every component doc:
1. Purpose
2. Source
3. Props / Parameters
4. Usage Examples
5. Accessibility Considerations
6. Edge Cases
7. Styling / Theming Notes
8. Testing Guidance
9. Changelog Notes

## Required Tables
Every doc must include:

### Props table
`Prop | Type | Required | Default | Description | Notes`

### Accessibility table
`Concern | Requirement | Implementation Notes | Test Method`

## Example Rules
- Include at least one basic usage snippet.
- Include at least one advanced or edge-case usage snippet.
- Use project conventions: Next.js + TypeScript + token-aware styling patterns.

## Authoring Workflow
1. Copy `_component-template.md`.
2. Rename it to `<ComponentName>.md`.
3. Fill all required sections and tables.
4. Verify API details against source code.
5. Add/update changelog date entry.

## Acceptance Checklist
- Section order is correct.
- Props defaults and types match code.
- Accessibility requirements are explicit and testable.
- Edge cases are concrete (not generic statements).
- Usage snippets are realistic and TypeScript-valid.
