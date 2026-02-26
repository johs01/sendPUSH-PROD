import fs from "node:fs/promises";
import path from "node:path";
import pixelmatch from "pixelmatch";
import { chromium } from "playwright";
import { PNG } from "pngjs";

const NEXT_URL = process.env.NEXT_URL ?? "http://localhost:3000/";
const PRODUCTION_URL = process.env.PRODUCTION_URL ?? "";
const FULLPAGE_DEVICE_SCALE = Number(process.env.PARITY_FULLPAGE_DEVICE_SCALE ?? "1");

const FULLPAGE_DARK_THRESHOLD = Number(process.env.PARITY_FULLPAGE_DARK_DIFF ?? "0.015");
const FULLPAGE_LIGHT_THRESHOLD = Number(process.env.PARITY_FULLPAGE_LIGHT_DIFF ?? "0.015");
const FULLPAGE_MAX_HEIGHT_DELTA = Number(process.env.PARITY_FULLPAGE_MAX_HEIGHT_DELTA ?? "0.02");
const FULLPAGE_MAX_WIDTH_DELTA = Number(process.env.PARITY_FULLPAGE_MAX_WIDTH_DELTA ?? "0.002");

const REGION_HERO_THRESHOLD = Number(process.env.PARITY_REGION_HERO_DIFF ?? "0.01");
const REGION_HEADER_THRESHOLD = Number(process.env.PARITY_REGION_HEADER_DIFF ?? "0.01");
const REGION_LOGO_STATS_THRESHOLD = Number(process.env.PARITY_REGION_LOGO_STATS_DIFF ?? "0.01");
const REGION_DOWNSTREAM_THRESHOLD = Number(process.env.PARITY_REGION_DOWNSTREAM_DIFF ?? "0.012");

const outputRoot = path.resolve(process.cwd(), ".parity");
const baselineDir = path.join(outputRoot, "baseline");
const fullpageDir = path.join(outputRoot, "fullpage");
const fullpageDiffDir = path.join(fullpageDir, "diff");

const targetFiles = {
  dark: path.join(baselineDir, "target-dark.png"),
  light: path.join(baselineDir, "target-light.png")
};

const currentFiles = {
  dark: path.join(baselineDir, "current-dark.png"),
  light: path.join(baselineDir, "current-light.png")
};

const localCaptureFiles = {
  dark: path.join(fullpageDir, "local-dark.png"),
  light: path.join(fullpageDir, "local-light.png")
};

const productionCaptureFiles = {
  dark: path.join(fullpageDir, "production-dark.png"),
  light: path.join(fullpageDir, "production-light.png")
};

const regionThresholdMap = {
  header: REGION_HEADER_THRESHOLD,
  hero: REGION_HERO_THRESHOLD,
  "hero-media-cta": REGION_HERO_THRESHOLD,
  "logo-grid-stats": REGION_LOGO_STATS_THRESHOLD,
  "pricing-header-toggle": REGION_DOWNSTREAM_THRESHOLD,
  "faq-cards": REGION_DOWNSTREAM_THRESHOLD,
  "tenant-footer-transition": REGION_DOWNSTREAM_THRESHOLD
};

function fullpageThreshold(mode) {
  return mode === "dark" ? FULLPAGE_DARK_THRESHOLD : FULLPAGE_LIGHT_THRESHOLD;
}

function scaleRect(rect, scale) {
  if (!rect || !Number.isFinite(scale) || scale <= 0) {
    return rect ?? null;
  }

  return {
    x: rect.x * scale,
    y: rect.y * scale,
    width: rect.width * scale,
    height: rect.height * scale
  };
}

function toErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

async function ensureOutputDirs() {
  await fs.mkdir(outputRoot, { recursive: true });
  await fs.mkdir(baselineDir, { recursive: true });
  await fs.rm(fullpageDir, { recursive: true, force: true });
  await fs.mkdir(fullpageDir, { recursive: true });
  await fs.mkdir(fullpageDiffDir, { recursive: true });
}

async function ensureReachable(url, label) {
  try {
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
      throw new Error(`${label} returned ${response.status}`);
    }
  } catch (error) {
    throw new Error(`${label} is not reachable at ${url}. ${toErrorMessage(error)}`);
  }
}

async function ensureFontsReady(page) {
  await page.waitForFunction(
    () => "fonts" in document && document.fonts.status !== "loading",
    undefined,
    { timeout: 15000 }
  );
  await page.waitForFunction(
    () => {
      if (!("fonts" in document)) {
        return false;
      }

      const checks = [
        document.fonts.check("700 16px 'Rodger Bold'"),
        document.fonts.check("500 16px Onest"),
        document.fonts.check("700 16px Onest")
      ];

      return checks.every(Boolean);
    },
    undefined,
    { timeout: 15000 }
  );
}

async function readPng(filePath) {
  const buffer = await fs.readFile(filePath);
  return PNG.sync.read(buffer);
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function clampRect(rect, width, height) {
  if (!rect) {
    return null;
  }

  const x1 = Math.max(0, Math.floor(rect.x));
  const y1 = Math.max(0, Math.floor(rect.y));
  const x2 = Math.min(width, Math.ceil(rect.x + rect.width));
  const y2 = Math.min(height, Math.ceil(rect.y + rect.height));

  if (x2 <= x1 || y2 <= y1) {
    return null;
  }

  return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
}

function cropRegion(png, rect) {
  const cropped = new PNG({ width: rect.width, height: rect.height });
  PNG.bitblt(png, cropped, rect.x, rect.y, rect.width, rect.height, 0, 0);
  return cropped;
}

function comparePngPair(basePng, candidatePng, diffPath) {
  // Compare only the shared top-aligned canvas to avoid penalizing extra tail height as pixel drift.
  const width = Math.min(basePng.width, candidatePng.width);
  const height = Math.min(basePng.height, candidatePng.height);
  const comparedBase = cropRegion(basePng, { x: 0, y: 0, width, height });
  const comparedCandidate = cropRegion(candidatePng, { x: 0, y: 0, width, height });
  const diffPng = new PNG({ width, height });

  const diffPixels = pixelmatch(
    comparedBase.data,
    comparedCandidate.data,
    diffPng.data,
    width,
    height,
    { threshold: 0.1, includeAA: false }
  );

  return {
    diffPixels,
    diffRatio: diffPixels / (width * height),
    width,
    height,
    diffPng
  };
}

async function captureMode(browser, { url, mode, outputPath, viewportWidth, viewportHeight }) {
  const context = await browser.newContext({
    viewport: { width: viewportWidth, height: viewportHeight },
    deviceScaleFactor: FULLPAGE_DEVICE_SCALE
  });
  await context.addInitScript((theme) => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-theme-mode", theme);
    root.style.colorScheme = theme;

    try {
      window.localStorage.setItem("wf-theme-mode", theme);
    } catch {
      // Ignore storage errors.
    }
  }, mode);

  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle" });
    await ensureFontsReady(page);

    const hasTheme = await page.evaluate(
      (expectedMode) =>
        document.documentElement.getAttribute("data-theme") === expectedMode ||
        document.documentElement.getAttribute("data-theme-mode") === expectedMode,
      mode
    );

    if (!hasTheme) {
      const toggle = page.locator("#wfThemeToggle");
      if ((await toggle.count()) > 0) {
        await toggle.click();
        await page.waitForTimeout(420);
      }
    }

    await page.evaluate((expectedMode) => {
      const root = document.documentElement;
      root.setAttribute("data-theme", expectedMode);
      root.setAttribute("data-theme-mode", expectedMode);
      root.style.colorScheme = expectedMode;

      try {
        window.localStorage.setItem("wf-theme-mode", expectedMode);
      } catch {
        // Ignore storage access issues.
      }
    }, mode);
    await page.waitForFunction(
      (expectedMode) =>
        document.documentElement.getAttribute("data-theme") === expectedMode ||
        document.documentElement.getAttribute("data-theme-mode") === expectedMode,
      mode,
      { timeout: 5000 }
    );
    await page.waitForTimeout(120);

    await page.addStyleTag({
      content:
        "html{scroll-behavior:auto!important}*,*::before,*::after{animation-duration:1ms!important;animation-iteration-count:1!important;transition-duration:1ms!important} .reveal{opacity:1!important;transform:none!important}"
    });
    await page.evaluate(() => {
      // Hide non-app fixed overlays (browser extensions/toolbars) that pollute screenshot diffs.
      const nextRoot = document.querySelector("#__next");
      document.querySelectorAll("body > *").forEach((node) => {
        if (!(node instanceof HTMLElement)) {
          return;
        }
        if (nextRoot && node === nextRoot) {
          return;
        }
        const style = window.getComputedStyle(node);
        if (style.position === "fixed") {
          node.setAttribute("data-parity-hidden-overlay", "true");
        }
      });
    });
    await page.addStyleTag({
      content: "[data-parity-hidden-overlay='true']{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}"
    });

    await page.evaluate(() => {
      document.querySelectorAll(".reveal").forEach((node) => node.classList.add("is-visible"));
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(180);

    const regions = await page.evaluate(() => {
      const toRect = (element) => {
        if (!(element instanceof HTMLElement)) {
          return null;
        }

        const rect = element.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) {
          return null;
        }

        return {
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY,
          width: rect.width,
          height: rect.height
        };
      };

      const unionRects = (...elements) => {
        const rects = elements.map((element) => toRect(element)).filter(Boolean);
        if (!rects.length) {
          return null;
        }

        const x1 = Math.min(...rects.map((rect) => rect.x));
        const y1 = Math.min(...rects.map((rect) => rect.y));
        const x2 = Math.max(...rects.map((rect) => rect.x + rect.width));
        const y2 = Math.max(...rects.map((rect) => rect.y + rect.height));

        return {
          x: x1,
          y: y1,
          width: x2 - x1,
          height: y2 - y1
        };
      };

      const header = document.querySelector("header");
      const hero = document.querySelector("#hero");
      const heroCta = document.querySelector("#hero [class*='EmailCta_shell'], #hero .wf-email-cta");
      const heroMedia = document.querySelector("#hero [data-label*='Hero image placeholder'], #hero .wf-placeholder");
      const logoGrid = document.querySelector("#logo-grid");
      const stats = document.querySelector("#stats");
      const pricingHeader = document.querySelector("#pricing h2");
      const pricingToggleMonthly = document.querySelector("#pricing [data-pricing-toggle='monthly']");
      const pricingToggleYearly = document.querySelector("#pricing [data-pricing-toggle='yearly']");
      const faq = document.querySelector("#faq");
      const tenant = document.querySelector("#tenant-trial-cta");
      const footer = document.querySelector("#site-footer");

      return {
        header: toRect(header),
        hero: toRect(hero),
        "hero-media-cta": unionRects(heroCta, heroMedia),
        "logo-grid-stats": unionRects(logoGrid, stats),
        "pricing-header-toggle": unionRects(
          pricingHeader,
          pricingToggleMonthly?.closest("div"),
          pricingToggleYearly?.closest("div")
        ),
        "faq-cards": toRect(faq),
        "tenant-footer-transition": unionRects(tenant, footer)
      };
    });

    await page.screenshot({ path: outputPath, fullPage: true });
    return regions;
  } finally {
    await page.close();
    await context.close();
  }
}

async function compareMode({
  mode,
  source,
  candidatePath,
  targetPath,
  regionRects,
  regionScale = 1,
  enforceRegions = true
}) {
  const targetPng = await readPng(targetPath);
  const candidatePng = await readPng(candidatePath);

  const fullDiffPath = path.join(fullpageDiffDir, `${source}-${mode}-full.png`);
  const fullComparison = comparePngPair(targetPng, candidatePng, fullDiffPath);
  await fs.writeFile(fullDiffPath, PNG.sync.write(fullComparison.diffPng));
  const widthDeltaRatio = Math.abs(candidatePng.width - targetPng.width) / targetPng.width;
  const heightDeltaRatio = Math.abs(candidatePng.height - targetPng.height) / targetPng.height;

  const fullThreshold = fullpageThreshold(mode);
  const regions = [];

  if (enforceRegions) {
    for (const [regionName, threshold] of Object.entries(regionThresholdMap)) {
    const rawRect = scaleRect(regionRects?.[regionName] ?? null, regionScale);
    const candidateRect = clampRect(rawRect, candidatePng.width, candidatePng.height);

    if (!candidateRect) {
      regions.push({
        name: regionName,
        pass: false,
        skipped: true,
        reason: "Region rectangle not found in candidate capture.",
        threshold
      });
      continue;
    }

    const mappedTargetRect = clampRect(rawRect, targetPng.width, targetPng.height);

    if (!mappedTargetRect) {
      regions.push({
        name: regionName,
        pass: false,
        skipped: true,
        reason: "Region rectangle could not be mapped to target capture.",
        threshold
      });
      continue;
    }

    const regionWidth = Math.min(mappedTargetRect.width, candidateRect.width);
    const regionHeight = Math.min(mappedTargetRect.height, candidateRect.height);
    if (regionWidth <= 0 || regionHeight <= 0) {
      regions.push({
        name: regionName,
        pass: false,
        skipped: true,
        reason: "Region rectangle resolved to an empty area.",
        threshold
      });
      continue;
    }

    const baseRegion = cropRegion(targetPng, {
      x: mappedTargetRect.x,
      y: mappedTargetRect.y,
      width: regionWidth,
      height: regionHeight
    });
    const candidateRegion = cropRegion(candidatePng, {
      x: candidateRect.x,
      y: candidateRect.y,
      width: regionWidth,
      height: regionHeight
    });
    const diffPng = new PNG({ width: regionWidth, height: regionHeight });
    const diffPixels = pixelmatch(
      baseRegion.data,
      candidateRegion.data,
      diffPng.data,
      regionWidth,
      regionHeight,
      { threshold: 0.1, includeAA: false }
    );
    const diffRatio = diffPixels / (regionWidth * regionHeight);
    const diffPath = path.join(fullpageDiffDir, `${source}-${mode}-${regionName}.png`);
    await fs.writeFile(diffPath, PNG.sync.write(diffPng));

    regions.push({
      name: regionName,
      pass: diffRatio <= threshold,
      diffRatio,
      threshold,
      diffPath
    });
  }
  }

  const regionsPass = regions.every((region) => region.pass || region.skipped);
  const fullPagePass =
    fullComparison.diffRatio <= fullThreshold &&
    widthDeltaRatio <= FULLPAGE_MAX_WIDTH_DELTA &&
    heightDeltaRatio <= FULLPAGE_MAX_HEIGHT_DELTA;
  const pass = fullPagePass && (enforceRegions ? regionsPass : true);

  return {
    source,
    mode,
    pass,
    targetPath,
    candidatePath,
    fullPage: {
      pass: fullPagePass,
      diffRatio: fullComparison.diffRatio,
      threshold: fullThreshold,
      widthDeltaRatio,
      widthDeltaThreshold: FULLPAGE_MAX_WIDTH_DELTA,
      heightDeltaRatio,
      heightDeltaThreshold: FULLPAGE_MAX_HEIGHT_DELTA,
      diffPath: fullDiffPath,
      width: fullComparison.width,
      height: fullComparison.height
    },
    regions
  };
}

async function ensureTargetFiles() {
  const missing = [];
  for (const mode of ["dark", "light"]) {
    if (!(await fileExists(targetFiles[mode]))) {
      missing.push(targetFiles[mode]);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required full-page baseline files:\n${missing
        .map((filePath) => `- ${filePath}`)
        .join("\n")}\nAdd target screenshots before running parity:fullpage.`
    );
  }
}

function flattenWorstItems(comparisons) {
  const items = [];
  for (const comparison of comparisons) {
    items.push({
      source: comparison.source,
      mode: comparison.mode,
      region: "__fullpage__",
      diffRatio: comparison.fullPage.diffRatio,
      threshold: comparison.fullPage.threshold
    });

    for (const region of comparison.regions) {
      if (region.skipped) {
        continue;
      }

      items.push({
        source: comparison.source,
        mode: comparison.mode,
        region: region.name,
        diffRatio: region.diffRatio,
        threshold: region.threshold
      });
    }
  }

  return items.sort((a, b) => b.diffRatio - a.diffRatio).slice(0, 10);
}

async function run() {
  await ensureOutputDirs();
  await ensureReachable(NEXT_URL, "Next page");
  await ensureTargetFiles();

  const browser = await chromium.launch({ headless: true });
  const regionRectsByMode = {};
  const comparisons = [];

  try {
    for (const mode of ["dark", "light"]) {
      const targetPng = await readPng(targetFiles[mode]);
      const viewportWidth = Math.max(360, Math.round(targetPng.width / FULLPAGE_DEVICE_SCALE));
      const viewportHeight = Math.min(1200, Math.max(780, Math.floor(targetPng.height / 4)));

      console.log(`Capturing local ${mode} full-page baseline at ${viewportWidth}x${viewportHeight}`);
      const localRegions = await captureMode(browser, {
        url: NEXT_URL,
        mode,
        outputPath: localCaptureFiles[mode],
        viewportWidth,
        viewportHeight
      });
      regionRectsByMode[mode] = localRegions;

      comparisons.push(
        await compareMode({
          mode,
          source: "local-preview",
          candidatePath: localCaptureFiles[mode],
          targetPath: targetFiles[mode],
          regionRects: localRegions,
          regionScale: FULLPAGE_DEVICE_SCALE,
          enforceRegions: true
        })
      );

      if (await fileExists(currentFiles[mode])) {
        comparisons.push(
          await compareMode({
            mode,
            source: "current-baseline",
            candidatePath: currentFiles[mode],
            targetPath: targetFiles[mode],
            regionRects: localRegions,
            regionScale: FULLPAGE_DEVICE_SCALE,
            enforceRegions: false
          })
        );
      }

      if (PRODUCTION_URL) {
        console.log(`Capturing production ${mode} from ${PRODUCTION_URL}`);
        await ensureReachable(PRODUCTION_URL, "Production page");
        const productionRegions = await captureMode(browser, {
          url: PRODUCTION_URL,
          mode,
          outputPath: productionCaptureFiles[mode],
          viewportWidth,
          viewportHeight
        });

        comparisons.push(
          await compareMode({
            mode,
            source: "production-live",
            candidatePath: productionCaptureFiles[mode],
            targetPath: targetFiles[mode],
            regionRects: productionRegions,
            regionScale: FULLPAGE_DEVICE_SCALE,
            enforceRegions: true
          })
        );
      }
    }
  } finally {
    await browser.close();
  }

  const worstTen = flattenWorstItems(comparisons);
  const failed = comparisons.filter((comparison) => !comparison.pass);
  const report = {
    nextUrl: NEXT_URL,
    productionUrl: PRODUCTION_URL || null,
    generatedAt: new Date().toISOString(),
    thresholds: {
      fullpageDark: FULLPAGE_DARK_THRESHOLD,
      fullpageLight: FULLPAGE_LIGHT_THRESHOLD,
      maxWidthDelta: FULLPAGE_MAX_WIDTH_DELTA,
      maxHeightDelta: FULLPAGE_MAX_HEIGHT_DELTA,
      regions: regionThresholdMap
    },
    baselineFiles: {
      target: targetFiles,
      current: currentFiles
    },
    totalComparisons: comparisons.length,
    failedComparisons: failed.length,
    worstTen,
    comparisons
  };

  const reportPath = path.join(outputRoot, "fullpage-report.json");
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

  console.log(`Full-page parity report written to ${reportPath}`);
  console.log("Worst 10 mismatches:");
  for (const item of worstTen) {
    console.log(
      `  ${item.source} ${item.mode} ${item.region} diff=${(item.diffRatio * 100).toFixed(
        3
      )}% threshold=${(item.threshold * 100).toFixed(3)}%`
    );
  }

  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
