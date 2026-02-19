# Button

## Purpose
`Button` is the shared primitive for clickable actions and navigational CTA links across REMY UI. Use it for consistent sizing, variant styling, and motion behavior. Do not use it for non-interactive visual elements.

## Source
- File: `/Users/johs777/Documents/New project/components/primitives/Button.tsx`
- Style: `/Users/johs777/Documents/New project/components/primitives/Button.module.css`
- Type: `Server-compatible component (no client hooks)`

## Props / Parameters
| Prop | Type | Required | Default | Description | Notes |
|---|---|---|---|---|---|
| `children` | `ReactNode` | Yes | - | Visible button label/content. | Required in both link and native button modes. |
| `variant` | `"primary" \| "secondary" \| "ghost"` | No | `"primary"` | Visual style variant. | Mapped internally through `variantClassMap`. |
| `size` | `"sm" \| "md" \| "lg"` | No | `"md"` | Control height/padding and font size. | Mapped internally through `sizeClassMap`. |
| `className` | `string` | No | - | Optional additional class names. | Merged with internal classes via `composeClassName`. |
| `href` | `string` | Conditional | - | When provided, renders as `next/link`. | Mutually exclusive with native button-only behavior. |
| `type` | `"button" \| "submit" \| "reset"` | No (native mode only) | `"button"` | Native button type attribute. | Default prevents accidental form submission. |
| `...anchorRest` | `Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" \| "className">` | No | - | Additional anchor attributes in link mode. | Example: `target`, `rel`, `aria-label`. |
| `...buttonRest` | `ButtonHTMLAttributes<HTMLButtonElement>` | No | - | Additional native button attributes in button mode. | Example: `disabled`, `onClick`, `name`, `value`. |

## Usage Examples

### Basic
```tsx
import { Button } from "@/components/primitives/Button";

export function HeroPrimaryAction() {
  return <Button>Start Free</Button>;
}
```

```tsx
import { Button } from "@/components/primitives/Button";

export function SecondaryLinkAction() {
  return (
    <Button href="#pricing" variant="secondary" size="md">
      See Pricing
    </Button>
  );
}
```

### Advanced
```tsx
import { Button } from "@/components/primitives/Button";

export function SaveFormButton() {
  return (
    <Button type="submit" variant="primary" size="lg">
      Save Changes
    </Button>
  );
}
```

```tsx
import { Button } from "@/components/primitives/Button";

export function DisabledButtonState() {
  return (
    <Button disabled variant="secondary">
      Processing...
    </Button>
  );
}
```

```tsx
import { Button } from "@/components/primitives/Button";

export function ExternalDocsButton() {
  return (
    <Button
      href="https://example.com/docs"
      target="_blank"
      rel="noopener noreferrer"
      variant="ghost"
      aria-label="Open SetupFlow docs in a new tab"
    >
      Open Docs
    </Button>
  );
}
```

## Accessibility Considerations
| Concern | Requirement | Implementation Notes | Test Method |
|---|---|---|---|
| Link vs button semantics | Use `href` only for navigation and native `<button>` for in-place actions. | Component auto-selects `Link` when `href` is present, otherwise native `<button>`. | Review rendered element in DOM + keyboard test |
| Keyboard interaction | Enter/Space should activate native button; Enter should activate link. | Native and link semantics are browser-standard with no JS override. | Manual keyboard test |
| Focus visibility | Focus ring must remain clearly visible on all variants and themes. | Verify focus styles are not suppressed by custom classes. | Tab-through test in light/dark |
| Color contrast | Text/icon contrast must stay readable for all variants and states. | Validate primary/secondary/ghost states and hover/active/disabled against WCAG targets. | Contrast audit + visual review |

## Edge Cases
- `children` is required. Rendering an unlabeled button/link is invalid and inaccessible.
- `disabled` only applies to native button mode. In link mode (`href` provided), emulate disabled with `aria-disabled="true"` and blocked navigation logic at caller level.
- Form safety relies on native default `type="button"` unless explicitly set to `submit` or `reset`.
- Long labels have no built-in truncation logic. In constrained layouts, labels may wrap unless consumer adds width/nowrap constraints.

## Styling / Theming Notes
- Token dependencies:
  - `--space-2`
  - `--radius-pill`
  - `--motion-duration-fast`
  - `--motion-ease-gentle`
  - `--motion-ease-standard`
  - `--color-brand-yellow`
  - `--color-brand-orange`
  - `--color-ink`
  - `--color-border-soft`
  - `--color-border-strong`
  - `--color-surface-soft`
  - `--shadow-card-soft`
- Variant classes:
  - `primary` = filled yellow CTA with orange edge shadow
  - `secondary` = bordered panel-like button
  - `ghost` = transparent background button
- Dark mode behavior:
  - Inherits token-driven color values from active theme variables.
- Reduced motion behavior:
  - `prefers-reduced-motion: reduce` disables transform motion on base/hover transitions.

## Testing Guidance
- Unit:
  - Renders `Link` when `href` exists.
  - Renders `<button type="button">` by default without `href`.
  - Applies default `variant="primary"` and `size="md"`.
- Integration:
  - Works in forms (`type="submit"` path).
  - Works in in-page anchors and route navigation.
- Accessibility:
  - Label presence, focus visibility, keyboard operation, contrast checks.
- Visual regression:
  - Capture all variants (`primary`, `secondary`, `ghost`) across `sm/md/lg`, light/dark.

## Changelog Notes
- `2026-02-19`: Initial documentation.
