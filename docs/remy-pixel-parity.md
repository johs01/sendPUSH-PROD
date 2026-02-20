# REMY Pixel Parity Harness

This project includes a screenshot parity harness to compare:

1. static REMY source page, and
2. live Next source-mirror page.

## Canonical URLs

- Next URL: `http://localhost:3000/`
- Static URL: `http://localhost:4100/wireframe-remy.html`

Override when needed:

```bash
NEXT_URL=http://localhost:3000 STATIC_URL=http://localhost:4100/wireframe-remy.html npm run parity:check
```

## What It Checks

### Viewports
1. `1440x900` (desktop)
2. `1024x1366` (tablet)
3. `390x844` (mobile)
4. `360x800` (mobile)

### States
1. light top
2. dark top
3. sticky scrolled
4. pricing yearly
5. FAQ open + hover
6. tenant form submitted
7. mobile menu open (mobile only)

## Threshold Policy

Global default: `PARITY_MAX_DIFF=0.015`.

Scenario thresholds are stricter for critical nav states:

1. `*-top-light`, `*-top-dark`: `0.006`
2. `*-sticky-scrolled`: `0.007`
3. `*-menu-open`: `0.0075`
4. Other scenarios: `PARITY_MAX_DIFF` default (`0.015`) unless overridden.

## Run Instructions

1. Start static source:

```bash
cd "/Users/johs777/Documents/New project"
python3 -m http.server 4100
```

2. Start Next app:

```bash
cd "/Users/johs777/Documents/New project"
npm run dev
```

3. Run parity check:

```bash
cd "/Users/johs777/Documents/New project"
npm run parity:check
```

## Output Artifacts

Directory: `/Users/johs777/Documents/New project/.parity`

1. `source/*.png` - static captures
2. `next/*.png` - Next captures
3. `diff/*.png` - pixel diffs
4. `report.json` - summary and per-scenario diff ratio

## CI Policy

1. Parity is required for UI-affecting REMY changes.
2. CI runs parity after build against live server + static source server.
3. PRs must include parity report snippet and viewport screenshots.

## Notes

1. Chromium is strict parity baseline.
2. Safari/Firefox require manual regression spot checks.
3. This harness is visual-only and complements selector/token contract checks.
