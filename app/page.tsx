import type { Metadata } from "next";
import Script from "next/script";
import {
  faqJsonLd,
  organizationJsonLd,
  siteConfig,
  websiteJsonLd
} from "@/lib/seo";
import { getRemyBodyHtml } from "@/lib/remy-source";

export const metadata: Metadata = {
  title: "Customer Messaging System",
  description:
    "Build your direct customer list, automate outreach, and send high-converting campaigns with SetupFlow.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "SetupFlow | Customer Messaging System",
    description:
      "Build your direct customer list, automate outreach, and send high-converting campaigns with SetupFlow.",
    url: siteConfig.url
  },
  twitter: {
    title: "SetupFlow | Customer Messaging System",
    description:
      "Build your direct customer list, automate outreach, and send high-converting campaigns with SetupFlow."
  }
};

export default async function Page() {
  const remyBodyHtml = await getRemyBodyHtml();

  return (
    <>
      <div
        id="remy-source-mirror"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: remyBodyHtml }}
      />

      <Script src="/remy/wireframe-remy.js" strategy="afterInteractive" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
