# ImageKit Security, Secrets, and Access

## Purpose

Define secure defaults for ImageKit usage in REMY.

## Secret Management Contract

1. `IMAGEKIT_PRIVATE_KEY` is server-side only.
2. `IMAGEKIT_PUBLIC_KEY` may be returned only where required for upload auth workflows.
3. `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` is safe for client use.
4. Never embed keys in source files, docs examples with real values, or browser logs.

## Upload Authentication Model

1. Client requests auth params from backend endpoint (for example `/api/upload-auth`).
2. Backend validates caller authorization.
3. Backend generates auth params (`token`, `expire`, `signature`) using private key.
4. Client calls `upload()` with returned auth params and public key.

## Private Access Controls

1. Keep private-key operations in server routes only.
2. Scope upload credentials to minimal validity windows.
3. Reject unauthorized requests to auth endpoint.

## Incident Response

1. Rotate `IMAGEKIT_PRIVATE_KEY` immediately on suspected exposure.
2. Audit deploy and access logs.
3. Invalidate compromised workflows and redeploy.
4. Record incident and remediation in ops notes.

## Security Anti-Patterns (Forbidden)

1. Importing server key into client component code.
2. Returning private key in API responses.
3. Writing secrets to git-tracked `.env` files.
4. Logging signatures, tokens, or keys to client-visible telemetry.

## Abuse Hardening Recommendations

1. Rate limit upload auth endpoint.
2. Enforce file type/size checks server-side before upload initiation.
3. Use authN/authZ checks before issuing upload credentials.

## Canonical Env Vars

1. `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`
2. `IMAGEKIT_PUBLIC_KEY`
3. `IMAGEKIT_PRIVATE_KEY`

## Cross-References

- `docs/imagekit/06-upload-auth-and-error-handling.md`
- `docs/imagekit/05-operations-runbook.md`
- `docs/process/imagekit-change-checklist.md`
