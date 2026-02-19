import type { Metadata } from "next";

const localUrl = "http://localhost:3000";

export const siteConfig = {
  name: "SetupFlow",
  shortName: "SetupFlow",
  url: process.env.NEXT_PUBLIC_SITE_URL || localUrl,
  description:
    "SetupFlow helps local teams run reminders, offers, and follow-ups from one place.",
  locale: "en_US",
  twitterHandle: "@setupflow"
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "SetupFlow | Customer Messaging System",
    template: "%s | SetupFlow"
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: "SetupFlow | Customer Messaging System",
    description: siteConfig.description,
    siteName: siteConfig.name
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: "SetupFlow | Customer Messaging System",
    description: siteConfig.description
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  email: "hello@setupflow.com",
  telephone: "+1-555-123-4567",
  address: {
    "@type": "PostalAddress",
    addressLocality: "San Francisco",
    addressCountry: "US"
  }
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  inLanguage: "en-US"
};

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How quickly can I launch my first campaign?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most teams launch in under one hour using prebuilt flows and templates."
      }
    },
    {
      "@type": "Question",
      name: "Can I import customers from my current tools?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. CSV import and common integrations are supported for fast migration."
      }
    },
    {
      "@type": "Question",
      name: "Will this work for multiple locations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can segment by location and run local campaigns from one account."
      }
    },
    {
      "@type": "Question",
      name: "How do you handle opt-outs and compliance?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Built-in consent handling and auto opt-out management are included by default."
      }
    },
    {
      "@type": "Question",
      name: "Do I need technical support to set this up?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Setup is no-code and designed for operators, marketers, and founders."
      }
    },
    {
      "@type": "Question",
      name: "Can I measure actual revenue impact?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Dashboard reports tie messages to bookings, visits, and attributed revenue."
      }
    }
  ]
};
