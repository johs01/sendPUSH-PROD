# Dependency Security Remediation Notes

This project uses a minimal-risk patch strategy for dependency security updates.

## Security policy

1. Patch vulnerable production dependencies first.
2. Treat development-only vulnerabilities as non-runtime risk, then schedule separate tooling upgrades.
3. Do not use forced major upgrades unless required.

## Baseline and verification commands

Run these locally (with internet access) from:

`/Users/johs777/Documents/New project`

```bash
npm ls --depth=2
npm audit --omit=dev
npm audit
```

## Remediation commands

```bash
npm install next@15.5.10 eslint-config-next@15.5.10
npm dedupe
npm install
```

## Why the major bump was required

`npm audit --omit=dev --audit-level=high` reports Next.js `10.0.0 - 15.5.9` as vulnerable.
There is no fully patched `14.x` line for that advisory, so moving to `15.5.10` is the
smallest secure runtime upgrade that clears production high/critical findings.

## Remaining full-tree findings (dev-only)

After runtime remediation, remaining findings are in the ESLint toolchain
(`ajv` / `minimatch` through `eslint@8` dependency paths). They do not affect production
runtime code paths and can be handled in a separate lint-stack upgrade window.

## Quality gate commands

```bash
npm run lint
npm run typecheck
npm run build
npm run audit:prod
npm run audit:full
npm run verify
```

## CI enforcement

GitHub Actions workflow:

`/Users/johs777/Documents/New project/.github/workflows/quality.yml`

The CI job blocks merges when lint, typecheck, build, or production dependency audit fails.
