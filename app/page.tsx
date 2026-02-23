import type { Metadata } from "next";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { CapTestimonialsSection } from "@/components/sections/CapTestimonialsSection";
import { ComparisonSection } from "@/components/sections/ComparisonSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { LogoGridSection } from "@/components/sections/LogoGridSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { StatsSection } from "@/components/sections/StatsSection";
import { TenantTrialSection } from "@/components/sections/TenantTrialSection";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { UseCaseSection } from "@/components/sections/UseCaseSection";
import { useCases } from "@/lib/content";
import {
  faqJsonLd,
  organizationJsonLd,
  siteConfig,
  websiteJsonLd
} from "@/lib/seo";

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

const testimonialOne = [
  {
    quote:
      "We stopped chasing social reach and started building direct conversations. In the first month alone, we filled 23 otherwise empty appointments.",
    author: "Mia R. - Studio Owner"
  }
];

const testimonialTwo = [
  {
    quote: "We booked 17 extra appointments in one weekend from a single campaign.",
    author: "Noah T. - Clinic Manager"
  },
  {
    quote: "Setup took less than an hour, and now our reminders run automatically every day.",
    author: "Kayla S. - Salon Owner"
  }
];

export default function Page() {
  return (
    <>
      <SiteHeader />
      <HeroSection />
      <LogoGridSection />
      <StatsSection />
      <ProblemSection />
      <TestimonialSection
        id="testimonial-1"
        eyebrow="Customer feedback"
        title="What Business Owners Are Saying"
        testimonials={testimonialOne}
        background="white"
        ctaText="Read More Stories"
      />
      {useCases.map((useCase) => (
        <UseCaseSection key={useCase.id} useCase={useCase} />
      ))}
      <TestimonialSection
        id="testimonial-2"
        eyebrow="More proof"
        title="What Real Customers Are Saying"
        testimonials={testimonialTwo}
        background="dark"
        emailCtaText="Start Free Trial"
        emailInputId="wf-email-proof"
      />
      <FeaturesSection />
      <CapTestimonialsSection />
      <ComparisonSection />
      <PricingSection />
      <ProcessSection />
      <FaqSection />
      <FinalCtaSection />
      <TenantTrialSection />
      <SiteFooter />

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
