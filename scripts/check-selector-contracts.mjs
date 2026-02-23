import fs from "node:fs/promises";
import path from "node:path";

const read = async (relativePath) =>
  fs.readFile(path.resolve(process.cwd(), relativePath), "utf8");

const files = {
  page: "app/page.tsx",
  globals: "app/globals.css",
  header: "components/navigation/SiteHeader.tsx",
  mobileMenu: "components/navigation/MobileMenu.tsx",
  pricing: "components/sections/PricingSection.tsx",
  tenantTrial: "components/sections/TenantTrialSection.tsx"
};

const orderedPageSections = [
  "<SiteHeader />",
  "<HeroSection />",
  "<LogoGridSection />",
  "<StatsSection />",
  "<ProblemSection />",
  "<TestimonialSection",
  "{useCases.map((useCase) => (",
  "<FeaturesSection />",
  "<CapTestimonialsSection />",
  "<ComparisonSection />",
  "<PricingSection />",
  "<ProcessSection />",
  "<FaqSection />",
  "<FinalCtaSection />",
  "<TenantTrialSection />",
  "<SiteFooter />"
];

const requiredChecks = [
  {
    name: "Source-mirror import removed from globals.css",
    test: ({ globals }) => !/@import\s+"\/remy\//.test(globals)
  },
  {
    name: "Source-mirror runtime markers removed from page",
    test: ({ page }) => !/getRemyBodyHtml|remy-source-mirror|remy\/wireframe-remy\.js/.test(page)
  },
  {
    name: "Desktop theme toggle id",
    test: ({ header }) => /id="wfThemeToggle"/.test(header)
  },
  {
    name: "Theme live region id",
    test: ({ header }) => /id="wfThemeLive"/.test(header)
  },
  {
    name: "Mobile menu toggle id",
    test: ({ header }) => /id="wfMobileMenuToggle"/.test(header)
  },
  {
    name: "Mobile menu root id",
    test: ({ mobileMenu }) => /id="wfMobileMenu"/.test(mobileMenu)
  },
  {
    name: "Mobile theme toggle id",
    test: ({ mobileMenu }) => /id="wfMobileThemeToggle"/.test(mobileMenu)
  },
  {
    name: "Pricing monthly toggle",
    test: ({ pricing }) => /data-pricing-toggle="monthly"/.test(pricing)
  },
  {
    name: "Pricing yearly toggle",
    test: ({ pricing }) => /data-pricing-toggle="yearly"/.test(pricing)
  },
  {
    name: "Pricing stack contract",
    test: ({ pricing }) => /data-pricing-stack=/.test(pricing)
  },
  {
    name: "Pricing billed label contract",
    test: ({ pricing }) => /wf-pricing-billed-label/.test(pricing)
  },
  {
    name: "Tenant trial form id",
    test: ({ tenantTrial }) => /id="wf-tenant-trial-form"/.test(tenantTrial)
  },
  {
    name: "Tenant trial name field id",
    test: ({ tenantTrial }) => /id="wf-tenant-name"/.test(tenantTrial)
  },
  {
    name: "Tenant trial business field id",
    test: ({ tenantTrial }) => /id="wf-tenant-business"/.test(tenantTrial)
  },
  {
    name: "Tenant trial email field id",
    test: ({ tenantTrial }) => /id="wf-tenant-email"/.test(tenantTrial)
  },
  {
    name: "Tenant trial location field id",
    test: ({ tenantTrial }) => /id="wf-tenant-location"/.test(tenantTrial)
  },
  {
    name: "Tenant trial website field id",
    test: ({ tenantTrial }) => /id="wf-tenant-website"/.test(tenantTrial)
  },
  {
    name: "Tenant trial success feedback id",
    test: ({ tenantTrial }) => /id="wf-tenant-form-success"/.test(tenantTrial)
  }
];

const assertPageOrder = (page) => {
  const missing = [];
  let cursor = 0;

  for (const snippet of orderedPageSections) {
    const idx = page.indexOf(snippet, cursor);
    if (idx === -1) {
      missing.push(snippet);
      continue;
    }
    cursor = idx + snippet.length;
  }

  return missing;
};

async function run() {
  const content = Object.fromEntries(
    await Promise.all(
      Object.entries(files).map(async ([key, relativePath]) => [key, await read(relativePath)])
    )
  );

  const failed = requiredChecks.filter((check) => !check.test(content)).map((check) => check.name);

  const missingPageOrder = assertPageOrder(content.page);
  if (missingPageOrder.length) {
    failed.push(`Page section order/content mismatch: ${missingPageOrder.join(", ")}`);
  }

  const removedRoutes = [
    "app/remy/withremy.css/route.ts",
    "app/remy/wireframe-remy.css/route.ts",
    "app/remy/wireframe-remy.js/route.ts",
    "lib/remy-source.ts"
  ];

  for (const relativePath of removedRoutes) {
    try {
      await fs.access(path.resolve(process.cwd(), relativePath));
      failed.push(`Legacy runtime file still exists: ${relativePath}`);
    } catch {
      // expected: file does not exist
    }
  }

  if (!failed.length) {
    console.log("Selector contract check passed.");
    return;
  }

  console.error("Selector contract check failed:");
  for (const item of failed) {
    console.error(`- ${item}`);
  }

  process.exitCode = 1;
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
