export const APP_NAME = "Chatterbox";
export const APP_DESCRIPTION =
  "The communications platform for everything important.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For individuals getting started",
    features: [
      "Up to 5 channels",
      "1,000 messages/month",
      "Basic integrations",
      "Community support",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/user/month",
    description: "For growing teams that need more",
    features: [
      "Unlimited channels",
      "Unlimited messages",
      "Advanced integrations",
      "Priority support",
      "Custom roles & permissions",
      "Analytics dashboard",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations with advanced needs",
    features: [
      "Everything in Pro",
      "SSO / SAML",
      "Dedicated account manager",
      "99.99% uptime SLA",
      "Advanced security controls",
      "Custom integrations",
      "Audit logs",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
] as const;
