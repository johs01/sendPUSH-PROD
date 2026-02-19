# Grid

## Purpose
`Grid` is the baseline responsive layout primitive for equal-width multi-column structures. Use it for card lists, logo strips, and section blocks that require tokenized spacing and predictable breakpoint collapse behavior.

## Source
- File: `/Users/johs777/Documents/New project/components/primitives/Grid.tsx`
- Style: `/Users/johs777/Documents/New project/components/primitives/Grid.module.css`
- Type: `Server-compatible component (no client hooks)`

## Props / Parameters
| Prop | Type | Required | Default | Description | Notes |
|---|---|---|---|---|---|
| `children` | `ReactNode` | Yes | - | Grid items to render. | Required. |
| `columns` | `"2" \| "3" \| "4" \| "6"` | No | `"3"` | Base column count variant. | Mapped internally through `columnClassMap`. |
| `className` | `string` | No | - | Additional class names. | Merged with base/column classes. |

## Usage Examples

### Basic
```tsx
import { Grid } from "@/components/primitives/Grid";

export function FeatureGrid() {
  return (
    <Grid columns="3">
      <article>Feature A</article>
      <article>Feature B</article>
      <article>Feature C</article>
    </Grid>
  );
}
```

### Advanced
```tsx
import { Grid } from "@/components/primitives/Grid";

export function PartnerLogoGrid() {
  return (
    <Grid columns="6" className="logoGrid">
      <div>Logo 1</div>
      <div>Logo 2</div>
      <div>Logo 3</div>
      <div>Logo 4</div>
      <div>Logo 5</div>
      <div>Logo 6</div>
      <div>Logo 7</div>
      <div>Logo 8</div>
    </Grid>
  );
}
```

## Accessibility Considerations
| Concern | Requirement | Implementation Notes | Test Method |
|---|---|---|---|
| Semantic grouping | Grid is presentational; semantic meaning must come from children/wrapper. | Use `ul/li`, `section/article`, or table semantics based on content type. | DOM structure review |
| Reading order | Keyboard and screen reader order must match DOM order, not visual placement assumptions. | Do not rely on CSS reordering for logical sequence. | Keyboard + screen reader linear test |
| Focus behavior | Focusable child elements must remain clearly visible and reachable at all breakpoints. | Ensure child components keep visible focus styles. | Tab-through test desktop/tablet/mobile |

## Edge Cases
- On mobile (`<=799.98px`), all column variants collapse to one column by design.
- At tablet widths (`800px-1399.98px`), `columns="6"` becomes 4 columns and `columns="4"` / `columns="3"` become 2 columns.
- `Grid` does not provide masonry or auto-fit behavior; unequal content heights can create ragged rows.
- Very dense interactive grids may need additional spacing overrides beyond the default `gap: var(--space-6)`.

## Styling / Theming Notes
- Token dependencies:
  - `--space-6` for gap
- Variant classes:
  - `.columns2`, `.columns3`, `.columns4`, `.columns6`
- Responsive rules:
  - Desktop: requested column variant
  - Tablet: reduced column sets for readability
  - Mobile: single-column stack
- Dark mode behavior:
  - No direct color tokens. Component remains theme-neutral.
- Reduced motion behavior:
  - No motion styles in this primitive.

## Testing Guidance
- Unit:
  - Default renders `.grid` + `.columns3`.
  - Correct column class is applied for each `columns` option.
- Integration:
  - Validate expected grid collapse behavior at breakpoints.
  - Validate content card widths remain readable in each mode.
- Accessibility:
  - Validate semantic wrapper/child roles are correct for the content domain.
- Visual regression:
  - Capture grids at 1440, 1024, 390, 360 with each `columns` variant.

## Changelog Notes
- `2026-02-19`: Initial documentation.
