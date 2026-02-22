# ImageKit Architecture and Service Modes

## Purpose

Define the approved ImageKit architecture for REMY and eliminate service ambiguity.

## Supported Modes

### 1) Media Library (Primary)

Store assets in ImageKit Media Library and deliver from your ImageKit URL endpoint.

This is the default and required mode for REMY production workflows.

Delivery pattern:

- `https://ik.imagekit.io/<IMAGEKIT_ID>/<ASSET_PATH_OR_FILE_ID>`

### 2) Web Proxy (Legacy / Migration Only)

Use full external source URLs with ImageKit transformations only for migration or short-term compatibility.

This mode is not the default and should be documented with a sunset plan when used.

## Locked Decisions for This Repo

1. Canonical image platform: ImageKit.
2. Canonical mode: Media Library primary.
3. Web Proxy is allowed only for temporary migration cases.
4. SDK baseline: `@imagekit/next`.

## Next.js Integration Contract

1. Use `ImageKitProvider` to define default `urlEndpoint`.
2. Use `Image` and `Video` components from `@imagekit/next` for transformation-aware rendering.
3. Keep URL generation centralized via provider and transformation props.

## Local Asset Interaction

1. Existing `assets/remy/*` references remain in source until migration updates are applied.
2. Local assets are staging/source material only after ImageKit migration begins.
3. Upload to ImageKit and then reference ImageKit URLs for production usage.

## Canonical Env Vars

1. `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`
2. `IMAGEKIT_PUBLIC_KEY`
3. `IMAGEKIT_PRIVATE_KEY`

## Cross-References

- `docs/imagekit/02-remy-implementation-playbook.md`
- `docs/imagekit/03-security-secrets-and-access.md`
- `docs/imagekit/04-transformations-responsive-performance-and-cost.md`
