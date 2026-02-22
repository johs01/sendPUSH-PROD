# ImageKit Upload Auth and Error Handling

## Purpose

Provide canonical secure upload flow guidance and operational error handling.

## Canonical Upload Flow

1. Client requests upload credentials from `/api/upload-auth`.
2. Server authenticates/authorizes caller.
3. Server generates `token`, `expire`, `signature` with private key.
4. Server returns `{ token, expire, signature, publicKey }`.
5. Client calls `upload()` with file and auth params.

## App Router Auth Endpoint Example

```ts
// File: app/api/upload-auth/route.ts
import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
  // TODO: add your auth check here

  const { token, expire, signature } = getUploadAuthParams({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string
  });

  return Response.json({
    token,
    expire,
    signature,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY
  });
}
```

## Client Upload Example Shape

```tsx
"use client";

import { upload } from "@imagekit/next";

export async function uploadFile(file: File) {
  const authRes = await fetch("/api/upload-auth");
  if (!authRes.ok) throw new Error("Failed to fetch upload auth params");
  const { token, expire, signature, publicKey } = await authRes.json();

  return upload({
    file,
    fileName: file.name,
    token,
    expire,
    signature,
    publicKey
  });
}
```

## Error Taxonomy

1. Invalid request errors (bad params, missing required upload fields).
2. Abort errors (user-cancelled or explicit abort signal).
3. Network errors (transport failure/timeouts).
4. Server errors (provider-side rejection/failure).

## Handling Rules

1. Show user-safe error messages; keep detailed errors in server logs.
2. Retry only idempotent-safe failures with backoff.
3. Do not retry validation failures without user correction.
4. Capture telemetry dimensions: endpoint status, error class, request ID (if available).

## Security Rules for Upload Flow

1. Never generate signatures in client code.
2. Keep private key usage strictly server-side.
3. Keep token expiry short and bounded.
4. Validate uploaded file constraints in app logic before upload.

## Canonical Env Contract

1. `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`
2. `IMAGEKIT_PUBLIC_KEY`
3. `IMAGEKIT_PRIVATE_KEY`

## Cross-References

- `docs/imagekit/03-security-secrets-and-access.md`
- `docs/imagekit/05-operations-runbook.md`
- `docs/process/imagekit-change-checklist.md`
