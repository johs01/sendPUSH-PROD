# ImageKit Operations Runbook

## Purpose

Define day-to-day operations for ImageKit-backed image workflows in REMY.

## Onboarding Prerequisites

1. ImageKit account and URL endpoint.
2. Environment variables configured:
- `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`
- `IMAGEKIT_PUBLIC_KEY`
- `IMAGEKIT_PRIVATE_KEY`
3. Deployment platform secrets configured for server-side vars.

## Operational Flows

### A) Asset Intake

1. Prepare source asset.
2. Upload to ImageKit Media Library.
3. Place into agreed folder/path convention.
4. Record usage intent (hero/logo/card/etc.).

### B) Transformation Updates

1. Define/update transformation parameters.
2. Validate visual output on representative breakpoints.
3. Update implementation references in canonical REMY files (in migration phase).

### C) Upload Auth Flow Operations

1. Maintain `/api/upload-auth` server endpoint.
2. Ensure endpoint performs auth checks before issuing credentials.
3. Monitor failures and abuse patterns.

### D) Rollback

1. Revert changed image references or transform settings.
2. Redeploy and verify visual recovery.
3. Document root cause and follow-up action.

## Release Verification

1. Image URLs resolve correctly in production.
2. No client-side secret leakage.
3. Responsive behavior remains correct on mobile/tablet/desktop.
4. No major payload regression for key pages.

## Maintenance Cadence

### Monthly

1. Review transformation usage and error trends.
2. Review upload-auth error patterns.

### Quarterly

1. Rotation check for image-related secrets.
2. Clean up stale assets and unused transformation patterns.
3. Audit docs for drift against implementation.

## Cross-References

- `docs/imagekit/03-security-secrets-and-access.md`
- `docs/imagekit/06-upload-auth-and-error-handling.md`
- `docs/process/imagekit-change-checklist.md`
