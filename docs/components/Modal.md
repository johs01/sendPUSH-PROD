# Modal

## Purpose
`Modal` is a reusable reference pattern for interruptive, focused workflows (confirmation, critical choices, short forms, and detail views) that require user attention above page content. Do not use modal dialogs for simple navigation or non-critical passive information.

## Source
- File: `N/A (reference API contract for future implementation)`
- Style: `N/A (token-driven modal module to be created when component is implemented)`
- Type: `Client Component`

## Props / Parameters
| Prop | Type | Required | Default | Description | Notes |
|---|---|---|---|---|---|
| `open` | `boolean` | Yes | - | Controls visibility state. | Component should be fully controlled. |
| `onOpenChange` | `(next: boolean) => void` | Yes | - | Callback used to open/close modal from parent. | Called on close actions (Esc, backdrop, close button). |
| `title` | `string` | Yes | - | Dialog title text. | Must be wired to `aria-labelledby`. |
| `description` | `string` | No | - | Supporting descriptive text. | Wire to `aria-describedby` when provided. |
| `initialFocusRef` | `RefObject<HTMLElement>` | No | - | Element to focus when modal opens. | Fallback to first focusable element if not provided. |
| `closeOnBackdrop` | `boolean` | No | `true` | Whether backdrop clicks close modal. | Keep `false` for destructive/critical flows. |
| `closeOnEsc` | `boolean` | No | `true` | Whether Escape key closes modal. | Keep `false` only when close must be explicit. |
| `children` | `ReactNode` | Yes | - | Dialog body content and actions. | Prefer semantic layout: body + footer actions. |

## Usage Examples

### Basic
```tsx
"use client";

import { useState } from "react";
import { Modal } from "@/components/overlays/Modal";
import { Button } from "@/components/primitives/Button";

export function BasicModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Confirm action"
        description="Please confirm to continue."
      >
        <p>This action will update your settings.</p>
      </Modal>
    </>
  );
}
```

### Advanced
```tsx
"use client";

import { useRef, useState } from "react";
import { Modal } from "@/components/overlays/Modal";
import { Button } from "@/components/primitives/Button";

export function ConfirmationModalExample() {
  const [open, setOpen] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Delete Segment
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Delete segment?"
        description="This cannot be undone."
        initialFocusRef={confirmRef}
        closeOnBackdrop={false}
      >
        <p>Removing this segment will detach it from active campaigns.</p>
        <div className="modalActionRow">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button ref={confirmRef} onClick={() => setOpen(false)}>
            Confirm Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}
```

```tsx
"use client";

import { useState } from "react";
import { Modal } from "@/components/overlays/Modal";
import { Button } from "@/components/primitives/Button";

export function LongContentModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>View campaign details</Button>
      <Modal open={open} onOpenChange={setOpen} title="Campaign Details">
        <div className="modalBodyScrollRegion">
          {/* long content list/table goes here */}
        </div>
        <footer className="modalFooterActions">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button onClick={() => setOpen(false)}>Save</Button>
        </footer>
      </Modal>
    </>
  );
}
```

## Accessibility Considerations
| Concern | Requirement | Implementation Notes | Test Method |
|---|---|---|---|
| Dialog semantics | Modal root must include `role="dialog"` and `aria-modal="true"`. | Use a dedicated dialog container element with explicit ARIA attributes. | DOM inspection + screen reader smoke test |
| Title/description mapping | Title and optional description must be correctly associated. | Wire `aria-labelledby` to title ID and `aria-describedby` to description ID. | Screen reader readout verification |
| Focus trap | Focus must remain inside modal while open. | Cycle Tab/Shift+Tab through focusable elements only in modal subtree. | Keyboard trap test |
| Close interactions | Esc and backdrop close should respect `closeOnEsc`/`closeOnBackdrop`. | Handle keyboard and pointer events centrally in modal root. | Manual interaction test |
| Focus return | Focus returns to trigger after modal closes. | Store trigger ref before open, restore on close. | Keyboard/open-close test |
| Scroll lock | Background content must not scroll while modal is open. | Apply body scroll lock with safe cleanup on unmount. | Scroll behavior test |
| Reduced motion | Open/close transitions should respect reduced motion settings. | Use tokenized transitions and disable/short-circuit under `prefers-reduced-motion`. | OS reduced-motion test |

## Edge Cases
- Nested modals are disallowed by default to avoid focus trap conflicts and escape handling ambiguity.
- Body scroll lock can conflict with other overlays; lock logic should be reference-counted if multiple overlays exist.
- Dynamic content (images, async lists) can shift layout after open; cap dialog dimensions and enable internal scrolling.
- SSR/hydration requires stable portal root handling; guard portal rendering until `document` is available.

## Styling / Theming Notes
- Token dependencies:
  - Surface/background: `--color-surface-*`
  - Text: `--color-ink`, `--color-text-muted`
  - Border: `--color-border-*`
  - Radius: `--radius-*`
  - Shadow: `--shadow-*`
  - Motion: `--motion-duration-*`, `--motion-ease-*`
- Variant classes:
  - Suggested: `root`, `backdrop`, `panel`, `header`, `body`, `footer`.
- Dark mode behavior:
  - Keep backdrop contrast and panel readability aligned with REMY dark tokens.
- Reduced motion behavior:
  - Disable scale/fade transform-heavy transitions while preserving visibility and focus management.

## Testing Guidance
- Unit:
  - Renders nothing when `open=false`.
  - Calls `onOpenChange(false)` on allowed close paths.
- Integration:
  - Focus trap, focus return, body scroll lock, portal rendering.
- Accessibility:
  - Role/ARIA wiring, keyboard loop, Esc behavior, screen reader announcement order.
- Visual regression:
  - Light/dark modes, long-content scroll, with/without description, action footer alignment.

## Changelog Notes
- `2026-02-19`: Initial reference documentation.
