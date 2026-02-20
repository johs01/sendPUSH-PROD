import fs from "node:fs/promises";
import path from "node:path";

const htmlPath = path.resolve(process.cwd(), "wireframe-remy.html");
const jsPath = path.resolve(process.cwd(), "wireframe-remy.js");

const requiredContracts = [
  {
    name: "Theme toggle (desktop)",
    pattern: /id=["']wfThemeToggle["']/
  },
  {
    name: "Theme toggle (mobile)",
    pattern: /id=["']wfMobileThemeToggle["']/
  },
  {
    name: "Mobile menu toggle",
    pattern: /id=["']wfMobileMenuToggle["']/
  },
  {
    name: "Mobile menu root",
    pattern: /id=["']wfMobileMenu["']/
  },
  {
    name: "Mobile menu close surface",
    pattern: /data-mobile-menu-close/
  },
  {
    name: "Mobile menu links container",
    pattern: /class=["'][^"']*wf-mobile-menu-links[^"']*["']/
  },
  {
    name: "Pricing toggles",
    pattern: /data-pricing-toggle=/
  },
  {
    name: "Pricing value stacks",
    pattern: /data-pricing-stack=/
  },
  {
    name: "Pricing billed labels",
    pattern: /class=["'][^"']*wf-pricing-billed-label[^"']*["']/
  },
  {
    name: "Reveal class",
    pattern: /class=["'][^"']*\breveal\b[^"']*["']/
  },
  {
    name: "Reveal order attribute",
    pattern: /data-reveal-order=/
  },
  {
    name: "Tenant trial form",
    pattern: /id=["']wf-tenant-trial-form["']/
  },
  {
    name: "Tenant name field",
    pattern: /id=["']wf-tenant-name["']/
  },
  {
    name: "Tenant business field",
    pattern: /id=["']wf-tenant-business["']/
  },
  {
    name: "Tenant email field",
    pattern: /id=["']wf-tenant-email["']/
  },
  {
    name: "Tenant location field",
    pattern: /id=["']wf-tenant-location["']/
  },
  {
    name: "Tenant website field",
    pattern: /id=["']wf-tenant-website["']/
  },
  {
    name: "Tenant success feedback",
    pattern: /id=["']wf-tenant-form-success["']/
  }
];

const requiredJsHooks = [
  "setupThemeMode",
  "setupStickyNav",
  "setupNavLiquidGlass",
  "setupSmoothAnchors",
  "setupReveal",
  "setupPricingBilling",
  "setupTenantTrialForm",
  "setupMobileMenu",
  "setupActiveNav"
];

async function run() {
  const [html, js] = await Promise.all([
    fs.readFile(htmlPath, "utf8"),
    fs.readFile(jsPath, "utf8")
  ]);

  const missingContracts = requiredContracts.filter((contract) => !contract.pattern.test(html));
  const missingJsHooks = requiredJsHooks.filter((hook) => !js.includes(`function ${hook}(`));

  if (!missingContracts.length && !missingJsHooks.length) {
    console.log("Selector contract check passed.");
    return;
  }

  if (missingContracts.length) {
    console.error("Missing HTML contracts:");
    missingContracts.forEach((contract) => {
      console.error(`- ${contract.name}`);
    });
  }

  if (missingJsHooks.length) {
    console.error("Missing JS setup hooks:");
    missingJsHooks.forEach((hook) => {
      console.error(`- ${hook}`);
    });
  }

  process.exitCode = 1;
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
