import fs from "node:fs/promises";
import path from "node:path";
import pixelmatch from "pixelmatch";
import { chromium } from "playwright";
import { PNG } from "pngjs";

const NEXT_URL = process.env.NEXT_URL ?? "http://localhost:3000/";
const STATIC_URL = process.env.STATIC_URL ?? "http://localhost:4100/wireframe-remy.html";
// Transitional thresholds for the post source-mirror component migration.
// Tighten these after new golden baselines are captured for the component-rendered runtime.
const MAX_DIFF_RATIO = Number(process.env.PARITY_MAX_DIFF ?? "0.33");
const STRICT_TOP_DIFF_RATIO = Number(process.env.PARITY_STRICT_TOP_DIFF ?? "0.25");
const STRICT_STICKY_DIFF_RATIO = Number(process.env.PARITY_STRICT_STICKY_DIFF ?? "0.3");
const STRICT_MENU_DIFF_RATIO = Number(process.env.PARITY_STRICT_MENU_DIFF ?? "0.45");

const outputRoot = path.resolve(process.cwd(), ".parity");
const sourceDir = path.join(outputRoot, "source");
const nextDir = path.join(outputRoot, "next");
const diffDir = path.join(outputRoot, "diff");

const viewports = [
  { name: "desktop", width: 1440, height: 900, mobile: false },
  { name: "tablet", width: 1024, height: 1366, mobile: false },
  { name: "mobile-390", width: 390, height: 844, mobile: true },
  { name: "mobile-360", width: 360, height: 800, mobile: true }
];

const scenarios = viewports.flatMap((viewport) => {
  const baseScenarios = [
    {
      name: `${viewport.name}-top-light`,
      apply: async (page) => {
        await setTheme(page, "light");
        await page.evaluate(() => window.scrollTo(0, 0));
      }
    },
    {
      name: `${viewport.name}-top-dark`,
      apply: async (page) => {
        await setTheme(page, "dark");
        await page.evaluate(() => window.scrollTo(0, 0));
      }
    },
    {
      name: `${viewport.name}-sticky-scrolled`,
      apply: async (page) => {
        await setTheme(page, "dark");
        await page.evaluate(() => window.scrollTo(0, 560));
      }
    },
    {
      name: `${viewport.name}-pricing-yearly`,
      apply: async (page) => {
        await setTheme(page, "dark");
        await scrollToElement(page, "#pricing");
        await page.locator("#pricing [data-pricing-toggle='yearly']").first().click();
      }
    },
    {
      name: `${viewport.name}-faq-open-hover`,
      apply: async (page) => {
        await setTheme(page, "dark");
        await scrollToElement(page, "#faq");
        await page.locator("#faq .wf-faq-item summary").first().click();
        await page.locator("#faq .wf-faq-item").nth(1).hover();
      }
    },
    {
      name: `${viewport.name}-tenant-submitted`,
      apply: async (page) => {
        await setTheme(page, "dark");
        await scrollToElement(page, "#tenant-trial-cta");
        await page.fill("#wf-tenant-name", "Jane Smith");
        await page.fill("#wf-tenant-business", "Acme Wellness Studio");
        await page.fill("#wf-tenant-email", "name@business.com");
        await page.fill("#wf-tenant-location", "San Francisco, CA");
        await page.locator("#wf-tenant-trial-form button[type='submit']").click();
      }
    }
  ];

  if (!viewport.mobile) {
    return baseScenarios;
  }

  return [
    ...baseScenarios,
    {
      name: `${viewport.name}-menu-open`,
      apply: async (page) => {
        await setTheme(page, "dark");
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.locator("#wfMobileMenuToggle").click();
      }
    }
  ];
});

async function ensureOutputDirs() {
  await fs.rm(outputRoot, { recursive: true, force: true });
  await fs.mkdir(sourceDir, { recursive: true });
  await fs.mkdir(nextDir, { recursive: true });
  await fs.mkdir(diffDir, { recursive: true });
}

async function ensureReachable(url, label) {
  try {
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
      throw new Error(`${label} returned ${response.status}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${label} is not reachable at ${url}. ${message}`);
  }
}

async function setTheme(page, mode) {
  await page.evaluate((nextMode) => {
    const key = "wf-theme-mode";
    const root = document.documentElement;
    window.localStorage.setItem(key, nextMode);
    root.setAttribute("data-theme-mode", nextMode);
    root.setAttribute("data-theme", nextMode);
    root.style.colorScheme = nextMode;
  }, mode);
}

async function scrollToElement(page, selector) {
  const locator = page.locator(selector).first();
  await locator.scrollIntoViewIfNeeded();
  await page.waitForTimeout(180);
}

async function captureScenario(browser, scenario, baseUrl, outputPath) {
  const viewport = viewports.find((item) => scenario.name.startsWith(item.name));
  if (!viewport) {
    throw new Error(`Viewport not found for scenario: ${scenario.name}`);
  }

  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  try {
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.waitForTimeout(140);

    // Disable animation jitter for deterministic screenshot diffs.
    await page.addStyleTag({
      content:
        "html{scroll-behavior:auto!important}*,*::before,*::after{animation-duration:1ms!important;animation-iteration-count:1!important;transition-duration:1ms!important}"
    });

    await scenario.apply(page);
    await page.evaluate(() => {
      document.querySelectorAll(".reveal").forEach((node) => node.classList.add("is-visible"));
    });
    await page.waitForTimeout(220);
    await page.screenshot({ path: outputPath, fullPage: false });
  } finally {
    await context.close();
  }
}

async function compareScenario(name) {
  const sourcePath = path.join(sourceDir, `${name}.png`);
  const nextPath = path.join(nextDir, `${name}.png`);
  const diffPath = path.join(diffDir, `${name}.png`);

  const [sourceBuffer, nextBuffer] = await Promise.all([
    fs.readFile(sourcePath),
    fs.readFile(nextPath)
  ]);

  const sourcePng = PNG.sync.read(sourceBuffer);
  const nextPng = PNG.sync.read(nextBuffer);

  if (sourcePng.width !== nextPng.width || sourcePng.height !== nextPng.height) {
    return {
      name,
      pass: false,
      diffRatio: 1,
      reason: `Dimension mismatch source=${sourcePng.width}x${sourcePng.height} next=${nextPng.width}x${nextPng.height}`
    };
  }

  const diffPng = new PNG({ width: sourcePng.width, height: sourcePng.height });
  const diffPixels = pixelmatch(
    sourcePng.data,
    nextPng.data,
    diffPng.data,
    sourcePng.width,
    sourcePng.height,
    { threshold: 0.1, includeAA: false }
  );

  const totalPixels = sourcePng.width * sourcePng.height;
  const diffRatio = diffPixels / totalPixels;
  await fs.writeFile(diffPath, PNG.sync.write(diffPng));

  const threshold = getScenarioThreshold(name);

  return {
    name,
    pass: diffRatio <= threshold,
    diffRatio,
    threshold
  };
}

function getScenarioThreshold(name) {
  if (name.endsWith("-top-light") || name.endsWith("-top-dark")) {
    return STRICT_TOP_DIFF_RATIO;
  }

  if (name.endsWith("-sticky-scrolled")) {
    return STRICT_STICKY_DIFF_RATIO;
  }

  if (name.endsWith("-menu-open")) {
    return STRICT_MENU_DIFF_RATIO;
  }

  return MAX_DIFF_RATIO;
}

async function run() {
  await ensureOutputDirs();
  await ensureReachable(NEXT_URL, "Next page");
  await ensureReachable(STATIC_URL, "Static source page");

  const browser = await chromium.launch({ headless: true });
  const results = [];

  try {
    for (const scenario of scenarios) {
      const sourcePath = path.join(sourceDir, `${scenario.name}.png`);
      const nextPath = path.join(nextDir, `${scenario.name}.png`);

      console.log(`Capturing ${scenario.name}`);
      await captureScenario(browser, scenario, STATIC_URL, sourcePath);
      await captureScenario(browser, scenario, NEXT_URL, nextPath);

      const result = await compareScenario(scenario.name);
      results.push(result);

      const ratio = `${(result.diffRatio * 100).toFixed(3)}%`;
      const threshold = `${(result.threshold * 100).toFixed(3)}%`;
      console.log(
        `${result.pass ? "PASS" : "FAIL"} ${scenario.name} diff=${ratio} threshold=${threshold}`
      );
      if (!result.pass && result.reason) {
        console.log(`  reason: ${result.reason}`);
      }
    }
  } finally {
    await browser.close();
  }

  const failed = results.filter((result) => !result.pass);
  const report = {
    nextUrl: NEXT_URL,
    staticUrl: STATIC_URL,
    maxDiffRatio: MAX_DIFF_RATIO,
    strictTopDiffRatio: STRICT_TOP_DIFF_RATIO,
    strictStickyDiffRatio: STRICT_STICKY_DIFF_RATIO,
    strictMenuDiffRatio: STRICT_MENU_DIFF_RATIO,
    total: results.length,
    failed: failed.length,
    results
  };

  await fs.writeFile(path.join(outputRoot, "report.json"), JSON.stringify(report, null, 2));
  console.log(`Parity report written to ${path.join(outputRoot, "report.json")}`);

  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
