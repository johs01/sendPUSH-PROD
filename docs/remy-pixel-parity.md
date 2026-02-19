# REMY Pixel Parity Harness

This project now includes a screenshot parity harness to compare the static REMY source page and the Next.js page.

## What it checks

The harness captures deterministic screenshots for these viewports:

1. `1440x900` (desktop)
2. `1024x1366` (tablet)
3. `390x844` (mobile)
4. `360x800` (mobile)

For each viewport, it captures these states:

1. Light top
2. Dark top
3. Sticky scrolled
4. Pricing yearly
5. FAQ open + hover
6. Tenant form submitted
7. Mobile menu open (mobile viewports only)

## Run instructions

1. Start the static source page:

```bash
cd "/Users/johs777/Documents/New project"
python3 -m http.server 4100
```

2. In another terminal, start Next:

```bash
cd "/Users/johs777/Documents/New project"
npm run dev
```

3. In a third terminal, run parity:

```bash
cd "/Users/johs777/Documents/New project"
npm run parity:check
```

## Output

Artifacts are written to:

`/Users/johs777/Documents/New project/.parity`

1. `source/*.png` - static captures
2. `next/*.png` - Next captures
3. `diff/*.png` - pixel diffs
4. `report.json` - pass/fail summary

Default pass threshold is `1.5%` diff ratio per screenshot.

Override threshold:

```bash
PARITY_MAX_DIFF=0.01 npm run parity:check
```

## Notes

1. This harness uses Chromium for strict parity.
2. Safari/Firefox still require manual verification for major regressions.
3. The harness expects:
   - Next URL: `http://localhost:3000/`
   - Static URL: `http://localhost:4100/wireframe-remy.html`

You can override these:

```bash
NEXT_URL=http://localhost:3000 STATIC_URL=http://localhost:4100/wireframe-remy.html npm run parity:check
```

