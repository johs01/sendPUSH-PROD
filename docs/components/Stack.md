# Stack

## Purpose
`Stack` is the baseline vertical layout primitive for consistent spacing between sequential elements. Use it to replace ad hoc margin chains and keep rhythm aligned to tokenized gap values.

## Source
- File: `/Users/johs777/Documents/New project/components/primitives/Stack.tsx`
- Style: `/Users/johs777/Documents/New project/components/primitives/Stack.module.css`
- Type: `Server-compatible component (no client hooks)`

## Props / Parameters
| Prop | Type | Required | Default | Description | Notes |
|---|---|---|---|---|---|
| `children` | `ReactNode` | Yes | - | Elements rendered in a vertical flex column. | Required. |
| `as` | `ElementType` | No | `"div"` | Rendered wrapper element. | Useful for semantic wrappers (`section`, `article`, `form`). |
| `gap` | `"2" \| "3" \| "4" \| "5" \| "6" \| "8" \| "10" \| "12" \| "16"` | No | `"4"` | Vertical spacing scale token choice. | Mapped internally through `gapClassMap`. |
| `align` | `"start" \| "center" \| "end" \| "stretch"` | No | `"stretch"` | Cross-axis alignment of stack items. | Mapped internally through `alignClassMap`. |
| `className` | `string` | No | - | Additional class names for composition. | Merged with base/gap/align classes. |

## Usage Examples

### Basic
```tsx
import { Stack } from "@/components/primitives/Stack";

export function FormFieldGroup() {
  return (
    <Stack gap="4">
      <label htmlFor="name">Name</label>
      <input id="name" type="text" />
      <button type="submit">Save</button>
    </Stack>
  );
}
```

### Advanced
```tsx
import { Stack } from "@/components/primitives/Stack";

export function CenteredCtaBlock() {
  return (
    <Stack as="section" gap="8" align="center" className="ctaBlock">
      <h2>Ready to launch?</h2>
      <p>Start with a campaign in minutes.</p>
      <a href="#tenant-trial-cta">Start Free Trial</a>
    </Stack>
  );
}
```

## Accessibility Considerations
| Concern | Requirement | Implementation Notes | Test Method |
|---|---|---|---|
| Semantic structure | Use `as` to provide meaningful sectioning when needed. | `Stack` itself is presentational; semantics come from wrapper and children. | DOM review |
| Focus traversal | Layout must not interfere with keyboard navigation order. | Keep DOM order aligned with intended interaction flow. | Tab-through test |
| Readability rhythm | Spacing should support scanning without separating related controls too far. | Choose `gap` values based on control grouping and heading hierarchy. | UX review + keyboard test |

## Edge Cases
- `Stack` currently does not spread arbitrary element props (for example `id`, `aria-*`, `data-*`) to the rendered element; add an outer wrapper if those are required.
- Very large gaps (`"12"`, `"16"`) can cause excessive vertical whitespace on small screens.
- `align="center"` or `align="end"` can shrink content width unexpectedly for intrinsically sized children.
- Mixed interactive/non-interactive children still require semantic grouping (`fieldset`, list, section) where appropriate.

## Styling / Theming Notes
- Token dependencies:
  - `--space-2`
  - `--space-3`
  - `--space-4`
  - `--space-5`
  - `--space-6`
  - `--space-8`
  - `--space-10`
  - `--space-12`
  - `--space-16`
- Variant classes:
  - Gap classes: `.gap2` ... `.gap16`
  - Align classes: `.alignStart`, `.alignCenter`, `.alignEnd`, `.alignStretch`
- Dark mode behavior:
  - No direct color tokens. Component remains theme-neutral.
- Reduced motion behavior:
  - No motion styles in this primitive.

## Testing Guidance
- Unit:
  - Default renders `.stack` + `.gap4` + `.alignStretch`.
  - Applies expected class per `gap` and `align` value.
- Integration:
  - Verify spacing consistency in form blocks and section layouts.
  - Verify `as` renders semantic wrapper as expected.
- Accessibility:
  - Validate that semantic parent context is provided when needed.
  - Validate keyboard order remains logical.
- Visual regression:
  - Capture representative stacks across multiple gap and align combinations.

## Changelog Notes
- `2026-02-19`: Initial documentation.
