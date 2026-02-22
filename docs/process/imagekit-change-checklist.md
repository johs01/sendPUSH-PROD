# ImageKit Change Checklist

Use this checklist for any PR that changes image delivery, upload workflows, transformation behavior, or related docs/contracts.

## 1) Security Gate

1. No secrets in diff (`IMAGEKIT_PRIVATE_KEY`, signatures, tokens).
2. No private key usage in client code.
3. Upload auth remains server-side.
4. Env var names follow canonical contract.

## 2) Contract Gate

1. `docs/design-registry.json` remains aligned with ImageKit service contract.
2. Docs references point to `docs/imagekit/*` module.
3. No stale Cloudflare-primary instructions remain.

## 3) UX and Responsiveness Gate

1. Validate affected media behavior on `360`, `375`, `390`, tablet, desktop.
2. Confirm no overflow/clipping introduced by image changes.
3. Confirm loading strategy (`eager` vs `lazy`) is intentional.

## 4) Performance and Cost Gate

1. Document impact of new transformation families.
2. Avoid unnecessary transformation cardinality growth.
3. Confirm LCP-critical assets are not over-transformed.

## 5) PR Notes Required

1. List changed image paths/identifiers.
2. Explain transformation rationale.
3. Include rollback instructions.
4. Include verification summary.
