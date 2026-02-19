export type NavItem = {
  id: string;
  label: string;
};

export type LogoItem = {
  src: string;
  alt: string;
};

export type StatItem = {
  value: string;
  label: string;
};

export type BulletItem = {
  text: string;
};

export type UseCaseItem = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  cta: string;
  placeholderLabel: string;
  reverse: boolean;
  tone: "salmon" | "white" | "peach";
};

export type FeatureItem = {
  iconTone: "orange" | "blue" | "yellow";
  title: string;
  body: string;
};

export type CapabilityTestimonial = {
  initials: string;
  name: string;
  role: string;
  quote: string;
};

export type ComparisonRow = {
  feature: string;
  setupflow: string;
  bulkSms: string;
  emailTool: string;
  manualFollowUp: string;
};

export type PricingPlan = {
  name: "Starter" | "Pro" | "Enterprise";
  copy: string;
  monthly?: string;
  yearly?: string;
  billingNote: string;
  cta: string;
  features: string[];
  highlighted?: boolean;
  popularLabel?: string;
  contactLabel?: string;
  contactNote?: string;
};

export type ProcessStep = {
  badge: string;
  title: string;
  body: string;
  tone: "orange" | "blue" | "yellow";
};

export type FaqItem = {
  question: string;
  answer: string;
  open?: boolean;
};

export const navItems: NavItem[] = [
  { id: "features", label: "Features" },
  { id: "comparison", label: "Comparison" },
  { id: "process", label: "How It Works" },
  { id: "faq", label: "FAQ" }
];

export const heroBullets: BulletItem[] = [
  { text: "Own your audience and contact data from day one." },
  { text: "Trigger reminders, offers, and follow-ups in minutes." },
  { text: "Keep customers engaged with timely personalized updates." }
];

export const logos: LogoItem[] = [
  { src: "/assets/remy/Google logo.webp", alt: "Google" },
  { src: "/assets/remy/Stripe Payment.webp", alt: "Stripe" },
  { src: "/assets/remy/Google Pay Logo.webp", alt: "Google Pay" },
  { src: "/assets/remy/Apple Pay Logo.webp", alt: "Apple Pay" },
  { src: "/assets/remy/AWS.webp", alt: "AWS" },
  { src: "/assets/remy/Digital Ocean.webp", alt: "DigitalOcean" },
  { src: "/assets/remy/Clover POS Logo.webp", alt: "Clover POS" },
  { src: "/assets/remy/Touch Bistro.webp", alt: "TouchBistro" },
  { src: "/assets/remy/Toast integrated with Loyaltymaster.webp", alt: "Toast integrated with Loyaltymaster" },
  { src: "/assets/remy/Loyaltymaster is Make Ready.webp", alt: "Loyaltymaster is Make ready" },
  { src: "/assets/remy/Loyaltymaster is Zapier Ready.webp", alt: "Loyaltymaster is Zapier ready" },
  { src: "/assets/remy/GDPR Ready.webp", alt: "GDPR ready" }
];

export const stats: StatItem[] = [
  { value: "95%", label: "Message deliverability" },
  { value: "+28%", label: "Repeat customer visits" },
  { value: "3x", label: "Faster follow-ups" },
  { value: "35%", label: "More booking recoveries" }
];

export const problemPoints = [
  {
    title: "Inboxes are overloaded",
    body: "Your updates compete with dozens of promotions every day."
  },
  {
    title: "Algorithms hide your posts",
    body: "Most of your audience never sees social updates in time to act."
  },
  {
    title: "Missed follow-ups cost revenue",
    body: "No-shows, empty slots, and quiet periods stack up each week."
  }
];

export const useCases: UseCaseItem[] = [
  {
    id: "use-case-1",
    eyebrow: "Use case 01",
    title: "Fill Last-Minute Sales and Activity Lulls",
    body: "Trigger time-sensitive messages when business slows down, not days later.",
    bullets: [
      "Auto-send offers during low-traffic windows.",
      "Target customers near your location.",
      "Bring back recent no-shows with one click."
    ],
    cta: "Launch Local Campaign",
    placeholderLabel: "Use case visual placeholder · 16:10",
    reverse: true,
    tone: "salmon"
  },
  {
    id: "use-case-2",
    eyebrow: "Use case 02",
    title: "Capture Nearby Customers with Geo-Fenced Messaging",
    body: "Reach customers while intent is high with offers based on proximity and behavior.",
    bullets: [
      "Set radius-based campaign zones in minutes.",
      "Suppress repeat sends to avoid fatigue.",
      "Track visits and redemptions from each zone."
    ],
    cta: "See Geo Tools",
    placeholderLabel: "Geo-fence visual placeholder · 16:10",
    reverse: false,
    tone: "white"
  },
  {
    id: "use-case-3",
    eyebrow: "Use case 03",
    title: "Fill Last-Minute Appointment Spots",
    body: "Recover cancellations fast with automated waitlist and flash-offer sequences.",
    bullets: [
      "Send opening alerts to likely responders first.",
      "Promote add-on services in the same message.",
      "Close open slots before they impact daily revenue."
    ],
    cta: "Recover Lost Slots",
    placeholderLabel: "Appointment flow placeholder · 16:10",
    reverse: true,
    tone: "peach"
  }
];

export const features: FeatureItem[] = [
  {
    iconTone: "orange",
    title: "Smart Segments",
    body: "Group customers by recency, spend, visit habits, and campaign response."
  },
  {
    iconTone: "blue",
    title: "Behavior Triggers",
    body: "Launch message flows based on customer actions in real time."
  },
  {
    iconTone: "yellow",
    title: "Campaign Calendar",
    body: "Plan seasonal offers and auto-activate them on schedule."
  },
  {
    iconTone: "blue",
    title: "Geo Messaging",
    body: "Send localized offers when customers are near your business."
  },
  {
    iconTone: "orange",
    title: "Revenue Tracking",
    body: "Measure conversions and attributed revenue from every campaign."
  },
  {
    iconTone: "yellow",
    title: "One Inbox",
    body: "Review responses, opt-outs, and follow-up tasks in one place."
  }
];

export const capabilityTestimonials: CapabilityTestimonial[] = [
  {
    initials: "MR",
    name: "Maya Rivera",
    role: "Operations Lead, Riverfront Wellness",
    quote:
      "SetupFlow gave us one place to run reminders, promos, and follow-ups. We filled more open slots in the first few weeks without adding extra admin work."
  },
  {
    initials: "JP",
    name: "Jordan Patel",
    role: "Owner, Northside Auto Care",
    quote:
      "We switched from manual texting to SetupFlow and saw campaign response jump fast. The team launches offers in minutes and tracks real impact each week."
  },
  {
    initials: "EB",
    name: "Elena Brooks",
    role: "General Manager, Elm Street Clinic",
    quote:
      "The automations are simple to set up and the reporting is clear. It helped us keep patients engaged and reduce missed appointments month over month."
  }
];

export const comparisonRows: ComparisonRow[] = [
  {
    feature: "Geo-fenced targeting",
    setupflow: "Yes",
    bulkSms: "No",
    emailTool: "No",
    manualFollowUp: "No"
  },
  {
    feature: "Behavior automations",
    setupflow: "Yes",
    bulkSms: "Limited",
    emailTool: "Limited",
    manualFollowUp: "No"
  },
  {
    feature: "Revenue attribution",
    setupflow: "Yes",
    bulkSms: "No",
    emailTool: "No",
    manualFollowUp: "No"
  },
  {
    feature: "Fast setup",
    setupflow: "Under 1 hour",
    bulkSms: "2-3 days",
    emailTool: "1-2 days",
    manualFollowUp: "Ongoing"
  }
];

export const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    copy: "For independent operators who want reliable customer messaging without team overhead.",
    monthly: "$19",
    yearly: "$13",
    billingNote: "Billed monthly.",
    cta: "Get Started with Starter",
    features: [
      "Message templates for promotions, reminders, and follow-ups.",
      "Up to 8 active customer campaigns at a time.",
      "Performance dashboard with delivery and response tracking."
    ]
  },
  {
    name: "Pro",
    copy: "Built for growing teams that need advanced automation, segmentation, and collaboration controls.",
    monthly: "$49",
    yearly: "$39",
    billingNote: "Billed monthly, per workspace.",
    cta: "Upgrade to Pro",
    popularLabel: "Most popular",
    highlighted: true,
    features: [
      "Unlimited campaigns, segments, and reusable automations.",
      "Higher-volume outreach with deeper conversion reporting.",
      "Team roles, approval flow, and advanced campaign controls."
    ]
  },
  {
    name: "Enterprise",
    copy: "For multi-location organizations that need custom workflows, tighter governance, and priority support.",
    billingNote: "",
    cta: "Talk to Sales",
    contactLabel: "Contact us",
    contactNote: "We will tailor pricing to your customer volume, security requirements, and rollout timeline.",
    features: [
      "Unlimited workspaces, users, and customer records.",
      "Compliance, security review, and dedicated onboarding support.",
      "Custom integrations, API access, and service-level agreements."
    ]
  }
];

export const processSteps: ProcessStep[] = [
  {
    badge: "1",
    title: "Connect Your Contacts",
    body: "Import your existing list and map customer tags in a few clicks.",
    tone: "orange"
  },
  {
    badge: "2",
    title: "Turn On Automations",
    body: "Choose campaign templates for reminders, promos, and reactivation.",
    tone: "blue"
  },
  {
    badge: "3",
    title: "Track Revenue Lift",
    body: "Monitor campaign performance and optimize every week.",
    tone: "yellow"
  }
];

export const faqs: FaqItem[] = [
  {
    question: "How quickly can I launch my first campaign?",
    answer: "Most teams launch in under one hour using prebuilt flows and templates.",
    open: true
  },
  {
    question: "Can I import customers from my current tools?",
    answer: "Yes. CSV import and common integrations are supported for fast migration."
  },
  {
    question: "Will this work for multiple locations?",
    answer: "Yes. You can segment by location and run local campaigns from one account."
  },
  {
    question: "How do you handle opt-outs and compliance?",
    answer: "Built-in consent handling and auto opt-out management are included by default."
  },
  {
    question: "Do I need technical support to set this up?",
    answer: "No. Setup is no-code and designed for operators, marketers, and founders."
  },
  {
    question: "Can I measure actual revenue impact?",
    answer: "Yes. Dashboard reports tie messages to bookings, visits, and attributed revenue."
  }
];

export const footerData = {
  productLinks: [
    "Automated Campaigns",
    "Smart Reminders",
    "Audience Segments",
    "Performance Reports",
    "Integrations"
  ],
  companyLinks: ["About SetupFlow", "Customer Stories", "Partner Program", "Careers", "Blog"]
};
