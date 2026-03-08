import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for teams of all sizes.",
};

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function PricingPage() {
  return (
    <section style={{ padding: "64px 0 96px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h1 style={{ fontSize: "clamp(32px, 4vw, 44px)", fontWeight: 700, color: "var(--heading)", letterSpacing: "-0.01em" }}>
            Simple, transparent pricing
          </h1>
          <p style={{ marginTop: 12, fontSize: 16, color: "var(--body)", maxWidth: 480, margin: "12px auto 0" }}>
            Start free. Upgrade when your team grows. No hidden fees.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 960, margin: "0 auto" }} className="pricing-grid">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              style={{
                backgroundColor: "var(--surface)",
                borderRadius: "var(--radius)",
                padding: 24,
                display: "flex",
                flexDirection: "column",
                border: plan.highlighted ? "2px solid var(--primary)" : "1px solid var(--border)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              {plan.highlighted && (
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                  Most Popular
                </div>
              )}
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--heading)" }}>{plan.name}</h3>
              <p style={{ marginTop: 4, fontSize: 13, color: "var(--body-light)" }}>{plan.description}</p>
              <div style={{ marginTop: 16, marginBottom: 24 }}>
                <span style={{ fontSize: 36, fontWeight: 700, color: "var(--heading)" }}>{plan.price}</span>
                {plan.period && <span style={{ fontSize: 14, color: "var(--body-light)" }}>{plan.period}</span>}
              </div>
              <ul style={{ listStyle: "none", flex: 1, marginBottom: 32 }}>
                {plan.features.map((feature) => (
                  <li key={feature} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                    <CheckIcon />
                    <span style={{ fontSize: 13, color: "var(--body)" }}>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href={plan.href}>
                <Button variant={plan.highlighted ? "primary" : "secondary"} fullWidth>
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .pricing-grid { grid-template-columns: 1fr !important; max-width: 400px !important; }
        }
      `}</style>
    </section>
  );
}
