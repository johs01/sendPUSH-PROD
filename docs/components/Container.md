# Container

## Purpose
`Container` is the baseline layout primitive for horizontal page bounds and section width control. Use it to keep content aligned to REMY container tokens (`main`, `focus`, `cta`, `full`) instead of hardcoding width values in feature sections.

## Source
- File: `/Users/johs777/Documents/New project/components/primitives/Container.tsx`
- Style: `/Users/johs777/Documents/New project/components/primitives/Container.module.css`
- Type: `Server-compatible component (no client hooks)`

## Props / Parameters
| Prop | Type | Required | Default | Description | Notes |
|---|---|---|---|---|---|
| `children` | `ReactNode` | Yes | - | Content rendered inside the container wrapper. | Required. |
| `as` | `ElementType` | No | `"div"` | Rendered element type. | Intended for semantic wrappers like `section`, `article`, `header`. |
| `size` | `"main" \| "focus" \| "full" \| "cta"` | No | `"main"` | Selects max-width behavior. | Mapped internally through `sizeClassMap`. |
| `className` | `string` | No | - | Additional class names for composition. | Merged after base/size classes. |

## Usage Examples

### Basic
```tsx
import { Container } from "@/components/primitives/Container";

export function BasicContentSection() {
  return (
    <Container>
      <h2>Section heading</h2>
      <p>Body content aligned to the main container width.</p>
    </Container>
  );
}
```

### Advanced
```tsx
import { Container } from "@/components/primitives/Container";

export function MixedWidthLayout() {
  return (
    <>
      <Container as="section" size="focus" className="sectionCard">
        <h2>Focused content block</h2>
      </Container>

      <Container as="section" size="full" className="fullBleedBand">
        <p>Full-width surface that spans the viewport.</p>
      </Container>
    </>
  );
}
```

## Accessibility Considerations
| Concern | Requirement | Implementation Notes | Test Method |
|---|---|---|---|
| Semantic structure | Use `as` to choose meaningful sectioning elements. | Prefer `section`, `main`, `article`, `header`, `footer` where appropriate. | DOM structure review |
| Landmark correctness | Do not rely on `Container` alone for ARIA landmarks. | Landmark roles and labels should be applied by parent structural components. | Screen reader landmark navigation |
| Reading order | Layout constraints must not alter logical content order. | Keep DOM order consistent with visual order across breakpoints. | Keyboard and SR linear reading test |

## Edge Cases
- `Container` currently does not spread arbitrary element props (for example `id`, `aria-*`, `data-*`) to the rendered element; wrap with a semantic parent when those are required.
- `size="full"` removes max-width and sets `width: 100%`; combine carefully with full-bleed backgrounds to avoid unexpected alignment shifts.
- Nested containers can compound horizontal spacing; avoid deep nesting unless each level has a clear width intent.
- Unknown `size` values are rejected by TypeScript and should not be bypassed.

## Styling / Theming Notes
- Token dependencies:
  - `--container-main`
  - `--container-focus`
  - `--container-cta`
- Class behavior:
  - `.container` applies centered horizontal bounds using `width: min(100% - 2rem, var(--container-main))`.
  - Mobile (`<=799.98px`) uses `width: min(100% - 1.5rem, var(--container-main))`.
  - `.main`, `.focus`, `.cta`, `.full` control max-width strategy.
- Dark mode behavior:
  - No direct color tokens. Component remains theme-neutral.
- Reduced motion behavior:
  - No motion styles in this primitive.

## Testing Guidance
- Unit:
  - Renders the default `div` with `size="main"` classes when no props are provided.
  - Applies expected size class for each `size` option.
- Integration:
  - Verify consistent alignment across sections using shared container sizes.
  - Verify `as` renders semantic element types.
- Accessibility:
  - Validate landmarks/headings are supplied by parent section components.
- Visual regression:
  - Capture desktop/tablet/mobile screenshots for `main`, `focus`, `cta`, and `full`.

## Changelog Notes
- `2026-02-19`: Initial documentation.
