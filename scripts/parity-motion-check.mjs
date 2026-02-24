import { chromium } from "playwright";

const NEXT_URL = process.env.NEXT_URL ?? "http://localhost:3000/";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
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

function parseDuration(rawValue) {
  return rawValue
    .split(",")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      if (chunk.endsWith("ms")) {
        return Number.parseFloat(chunk);
      }
      if (chunk.endsWith("s")) {
        return Number.parseFloat(chunk) * 1000;
      }
      return Number.parseFloat(chunk);
    })
    .filter(Number.isFinite);
}

function isAllZeroDurations(rawValue) {
  const durations = parseDuration(rawValue);
  return durations.length > 0 && durations.every((value) => Math.abs(value) <= 0.0001);
}

async function runDesktopMotionChecks(browser) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "no-preference"
  });
  const page = await context.newPage();

  try {
    await page.goto(NEXT_URL, { waitUntil: "networkidle" });
    await ensureFontsReady(page);

    const shell = page.locator("header div[class*='SiteHeader_shell']").first();
    await shell.waitFor({ state: "visible" });

    const beforePosition = await shell.evaluate((node) => {
      const style = getComputedStyle(node);
      return {
        x: style.getPropertyValue("--wf-nav-mx").trim(),
        y: style.getPropertyValue("--wf-nav-my").trim()
      };
    });

    const box = await shell.boundingBox();
    assert(Boolean(box), "Header shell bounding box was not available.");
    assert(box !== null, "Header shell did not render for pointer-motion checks.");

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(40);
    await page.mouse.move(box.x + 8, box.y + 8);
    await page.waitForTimeout(120);

    const afterPosition = await shell.evaluate((node) => {
      const style = getComputedStyle(node);
      return {
        x: style.getPropertyValue("--wf-nav-mx").trim(),
        y: style.getPropertyValue("--wf-nav-my").trim(),
        interactive: node.className.includes("interactive")
      };
    });

    assert(
      beforePosition.x !== afterPosition.x || beforePosition.y !== afterPosition.y,
      "Header glass pointer variables (--wf-nav-mx/--wf-nav-my) did not react to pointer movement."
    );
    assert(afterPosition.interactive, "Header interactive class was not enabled on pointer interaction.");

    const initialTheme = await page.evaluate(() => document.documentElement.dataset.theme);
    await page.click("#wfThemeToggle");
    await page.waitForTimeout(40);

    const themeStateDuringTransition = await page.evaluate(() => ({
      hasAnimating: document.documentElement.classList.contains("theme-animating"),
      theme: document.documentElement.dataset.theme
    }));

    assert(themeStateDuringTransition.hasAnimating, "theme-animating class did not apply after theme toggle.");
    assert(
      themeStateDuringTransition.theme !== initialTheme,
      "Theme dataset did not change after toggling."
    );

    await page.waitForTimeout(420);
    const hasAnimatingAfter = await page.evaluate(() =>
      document.documentElement.classList.contains("theme-animating")
    );
    assert(!hasAnimatingAfter, "theme-animating class was not removed after transition duration.");

    const revealCandidate = await page.evaluate(() => {
      const nodes = [...document.querySelectorAll(".reveal")];
      const target = nodes.find((node) => node.getBoundingClientRect().top > window.innerHeight * 1.15);

      if (!target) {
        return { found: false };
      }

      target.setAttribute("data-motion-target", "true");
      return {
        found: true,
        wasVisible: target.classList.contains("is-visible")
      };
    });

    assert(revealCandidate.found, "Could not find an off-screen reveal element to validate.");
    assert(!revealCandidate.wasVisible, "Off-screen reveal element was visible before scrolling.");

    await page.locator("[data-motion-target='true']").scrollIntoViewIfNeeded();
    await page.waitForTimeout(320);

    const revealStateAfter = await page
      .locator("[data-motion-target='true']")
      .evaluate((node) => node.classList.contains("is-visible"));
    assert(revealStateAfter, "Reveal element did not transition to visible after scroll.");

    const cta = page
      .locator("#hero a")
      .filter({ hasText: "Start Free in 2 Minutes" })
      .first();
    await cta.waitFor({ state: "visible" });

    const ctaBefore = await cta.evaluate((node) => {
      const style = getComputedStyle(node);
      const beforeStyle = getComputedStyle(node, "::before");
      return {
        transform: style.transform,
        shadow: style.boxShadow,
        beforeOpacity: beforeStyle.opacity,
        beforeTransform: beforeStyle.transform
      };
    });

    await cta.hover();
    await page.waitForTimeout(120);

    const ctaAfter = await cta.evaluate((node) => {
      const style = getComputedStyle(node);
      const beforeStyle = getComputedStyle(node, "::before");
      return {
        transform: style.transform,
        shadow: style.boxShadow,
        beforeOpacity: beforeStyle.opacity,
        beforeTransform: beforeStyle.transform
      };
    });

    assert(
      ctaBefore.transform !== ctaAfter.transform || ctaBefore.shadow !== ctaAfter.shadow,
      "CTA hover did not change transform/box-shadow."
    );
    assert(
      ctaBefore.beforeOpacity !== ctaAfter.beforeOpacity ||
        ctaBefore.beforeTransform !== ctaAfter.beforeTransform,
      "CTA sheen (::before) did not react on hover."
    );
  } finally {
    await context.close();
  }
}

async function runMobileMenuChecks(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "no-preference"
  });
  const page = await context.newPage();

  try {
    await page.goto(NEXT_URL, { waitUntil: "networkidle" });
    await ensureFontsReady(page);

    await page.click("#wfMobileMenuToggle");
    await page.waitForTimeout(180);

    const openState = await page.evaluate(() => {
      const menu = document.getElementById("wfMobileMenu");
      const panel = menu?.querySelector("[role='dialog']");
      const active = document.activeElement;
      return {
        bodyLocked: document.body.classList.contains("wf-mobile-menu-open"),
        menuOpen: Boolean(menu && menu.className.includes("open")),
        activeInPanel: Boolean(panel && active && panel.contains(active))
      };
    });

    assert(openState.bodyLocked, "Body lock class not applied when mobile menu opens.");
    assert(openState.menuOpen, "Mobile menu did not enter open state.");
    assert(openState.activeInPanel, "Initial focus is not inside the mobile menu panel.");

    for (let step = 0; step < 8; step += 1) {
      await page.keyboard.press("Tab");
      const focusInside = await page.evaluate(() => {
        const menu = document.getElementById("wfMobileMenu");
        const panel = menu?.querySelector("[role='dialog']");
        const active = document.activeElement;
        return Boolean(panel && active && panel.contains(active));
      });
      assert(focusInside, "Focus trap failed: focus escaped the mobile menu.");
    }

    const staggerDelays = await page.evaluate(() => {
      const links = [
        ...document.querySelectorAll("#wfMobileMenu nav a")
      ];
      return links.map((link) => {
        const delay = getComputedStyle(link).transitionDelay;
        const [first = "0s"] = delay.split(",");
        return first.trim();
      });
    });

    assert(staggerDelays.length >= 4, "Mobile menu links were not found for stagger timing checks.");
    const staggerValues = staggerDelays.map((value) => parseDuration(value)[0] ?? 0);
    assert(
      staggerValues[1] > staggerValues[0] &&
        staggerValues[2] > staggerValues[1] &&
        staggerValues[3] > staggerValues[2],
      "Mobile menu staggered animation delays are not increasing."
    );

    await page.keyboard.press("Escape");
    await page.waitForTimeout(360);

    const closedState = await page.evaluate(() => ({
      bodyLocked: document.body.classList.contains("wf-mobile-menu-open"),
      menuExists: Boolean(document.getElementById("wfMobileMenu"))
    }));

    assert(!closedState.bodyLocked, "Body lock class persisted after closing mobile menu.");
    assert(!closedState.menuExists, "Mobile menu did not unmount after close transition.");
  } finally {
    await context.close();
  }
}

async function runReducedMotionChecks(browser) {
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce"
  });

  try {
    const page = await desktopContext.newPage();
    await page.goto(NEXT_URL, { waitUntil: "networkidle" });
    await ensureFontsReady(page);

    await page.click("#wfThemeToggle");
    await page.waitForTimeout(60);

    const themeTransitionApplied = await page.evaluate(() =>
      document.documentElement.classList.contains("theme-animating")
    );
    assert(
      !themeTransitionApplied,
      "theme-animating class should not apply when prefers-reduced-motion is enabled."
    );

    const cta = page
      .locator("#hero a")
      .filter({ hasText: "Start Free in 2 Minutes" })
      .first();
    await cta.waitFor({ state: "visible" });

    const ctaDurations = await cta.evaluate((node) => {
      const base = getComputedStyle(node).transitionDuration;
      const before = getComputedStyle(node, "::before").transitionDuration;
      return { base, before };
    });
    assert(
      isAllZeroDurations(ctaDurations.base) && isAllZeroDurations(ctaDurations.before),
      "CTA transitions are not disabled under reduced motion."
    );
  } finally {
    await desktopContext.close();
  }

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce"
  });

  try {
    const page = await mobileContext.newPage();
    await page.goto(NEXT_URL, { waitUntil: "networkidle" });
    await ensureFontsReady(page);

    await page.click("#wfMobileMenuToggle");
    await page.waitForTimeout(80);

    const durations = await page.evaluate(() => {
      const overlay = document.getElementById("wfMobileMenu");
      const panel = overlay?.querySelector("[role='dialog']");
      const firstLink = overlay?.querySelector("nav a");
      const closeButton = overlay?.querySelector("button[aria-label='Close menu']");

      return {
        overlay: overlay ? getComputedStyle(overlay).transitionDuration : "",
        panel: panel ? getComputedStyle(panel).transitionDuration : "",
        link: firstLink ? getComputedStyle(firstLink).transitionDuration : "",
        close: closeButton ? getComputedStyle(closeButton).transitionDuration : ""
      };
    });

    assert(
      isAllZeroDurations(durations.overlay) &&
        isAllZeroDurations(durations.panel) &&
        isAllZeroDurations(durations.link) &&
        isAllZeroDurations(durations.close),
      "Mobile menu transitions are not fully disabled under reduced motion."
    );
  } finally {
    await mobileContext.close();
  }
}

async function run() {
  await ensureReachable(NEXT_URL, "Next page");
  const browser = await chromium.launch({ headless: true });

  try {
    console.log("Running desktop motion checks...");
    await runDesktopMotionChecks(browser);
    console.log("PASS desktop motion checks");

    console.log("Running mobile menu motion checks...");
    await runMobileMenuChecks(browser);
    console.log("PASS mobile menu motion checks");

    console.log("Running reduced-motion assertions...");
    await runReducedMotionChecks(browser);
    console.log("PASS reduced-motion assertions");
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
