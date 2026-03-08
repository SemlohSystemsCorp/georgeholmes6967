export const APP_NAME = "Chatterbox";
export const APP_DESCRIPTION =
  "The communications platform for everything important.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const PLANS = [
  {
    name: "Hobby",
    slug: "free",
    price: "$0",
    period: "forever",
    description: "For individuals, small clubs, and testing",
    features: [
      "Unlimited users",
      "Basic text chat",
      "Last 1,000 messages per channel",
      "500 MB file storage",
      "1 active organization",
      "Standard invite codes",
    ],
    limitations: [
      "No video/audio calls",
      "No advanced search",
      "No audit logs",
    ],
    cta: "Get Started",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    slug: "pro",
    price: "$29",
    period: "/mo per org",
    description: "For startups, dev teams, and serious communities",
    features: [
      "Unlimited users",
      "Unlimited message history",
      "50 GB file storage",
      "Video & audio calls (WebRTC)",
      "Advanced full-text search",
      "Custom invite codes with expiry",
      "Rich media & syntax highlighting",
      "Priority email support",
    ],
    limitations: [],
    cta: "Start Free Trial",
    href: "/checkout/pro",
    highlighted: true,
  },
  {
    name: "Enterprise",
    slug: "enterprise",
    price: "$99",
    period: "/mo + overage",
    description: "For large communities and data-heavy orgs",
    features: [
      "Everything in Pro",
      "500 GB file storage included",
      "Audit logs (immutable)",
      "SSO readiness (SAML/OIDC)",
      "Custom retention policies",
      "Data export (JSON/CSV)",
      "Dedicated infrastructure",
      "Overage: $0.10/GB/mo after 500 GB",
    ],
    limitations: [],
    cta: "Start Free Trial",
    href: "/checkout/enterprise",
    highlighted: false,
  },
] as const;
