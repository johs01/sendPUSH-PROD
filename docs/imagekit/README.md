# ImageKit Playbook (REMY Canonical)

This is the canonical image platform documentation for REMY.

ImageKit is the source of truth for image delivery, transformations, and secure upload auth patterns in this repository.

## Audience

1. Frontend technicians implementing media in REMY surfaces.
2. Backend/API operators implementing upload auth and secure workflows.
3. Platform maintainers responsible for env vars, key rotation, and deployment settings.
4. LLM agents assisting with implementation and maintenance.

## Read This First

1. Architecture and service modes: `docs/imagekit/01-architecture-and-service-modes.md`
2. REMY implementation playbook: `docs/imagekit/02-remy-implementation-playbook.md`
3. Security, secrets, and access: `docs/imagekit/03-security-secrets-and-access.md`
4. Transformations, responsive behavior, performance and cost: `docs/imagekit/04-transformations-responsive-performance-and-cost.md`
5. Operations runbook: `docs/imagekit/05-operations-runbook.md`
6. Upload auth and error handling: `docs/imagekit/06-upload-auth-and-error-handling.md`
7. PR checklist: `docs/process/imagekit-change-checklist.md`

## Non-Negotiables

1. Never expose `IMAGEKIT_PRIVATE_KEY` to client components, browser bundles, or logs.
2. Generate upload auth params server-side only.
3. Never commit private keys, tokens, or secrets to this repository.
4. Keep ImageKit as the canonical image service for REMY unless an explicit architecture change is approved.

## Canonical Environment Contract

1. `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`
2. `IMAGEKIT_PUBLIC_KEY`
3. `IMAGEKIT_PRIVATE_KEY`

## Related Governance Docs

- `docs/PROJECT_CONTEXT.md`
- `docs/architecture/repository-system-overview.md`
- `docs/design-registry.json`
- `docs/process/imagekit-change-checklist.md`
