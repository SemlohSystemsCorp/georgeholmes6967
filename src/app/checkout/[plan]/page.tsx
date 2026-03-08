"use client";

import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { PLANS } from "@/lib/constants";
import { useState, CSSProperties } from "react";
import Link from "next/link";

const container: CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "var(--bg)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "40px 16px",
};

const featureCheck: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 14,
  color: "var(--body)",
};

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const planSlug = params.plan as string;
  const plan = PLANS.find((p) => p.slug === planSlug);

  if (!plan || plan.slug === "free") {
    return (
      <div style={container}>
        <Logo size="lg" />
        <div style={{ maxWidth: 480, width: "100%", marginTop: 32 }}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--heading)", marginBottom: 8 }}>Plan not found</h3>
              <p style={{ fontSize: 14, color: "var(--body)", marginBottom: 24 }}>
                The plan you&apos;re looking for doesn&apos;t exist or isn&apos;t available for checkout.
              </p>
              <Link href="/pricing" style={{ color: "var(--primary)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
                View pricing plans
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  async function handleCheckout() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planSlug }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push(`/login?redirect=/checkout/${planSlug}`);
          return;
        }
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div style={container}>
      <Logo size="lg" />
      <div style={{ maxWidth: 480, width: "100%", marginTop: 32 }}>
        <Card>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: 20,
              backgroundColor: plan.highlighted ? "var(--primary-light)" : "var(--bg)",
              fontSize: 12,
              fontWeight: 600,
              color: plan.highlighted ? "var(--primary)" : "var(--body)",
              marginBottom: 16,
            }}>
              {plan.name} Plan
            </div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4 }}>
              <span style={{ fontSize: 40, fontWeight: 700, color: "var(--heading)" }}>{plan.price}</span>
              {plan.period && (
                <span style={{ fontSize: 14, color: "var(--body-light)" }}>{plan.period}</span>
              )}
            </div>
            <p style={{ fontSize: 14, color: "var(--body)", marginTop: 8 }}>{plan.description}</p>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20, marginBottom: 24 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--heading)", marginBottom: 12 }}>What&apos;s included:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {plan.features.map((feature) => (
                <div key={feature} style={featureCheck}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ fontSize: 13, color: "var(--error)", backgroundColor: "var(--error-light)", border: "1px solid rgba(229,107,107,0.2)", borderRadius: "var(--radius)", padding: "8px 12px", marginBottom: 16, textAlign: "center" }}>
              {error}
            </div>
          )}

          <Button onClick={handleCheckout} loading={loading} fullWidth size="lg">
            {plan.slug === "enterprise" ? "Contact Sales" : `Subscribe to ${plan.name}`}
          </Button>

          <p style={{ fontSize: 12, color: "var(--body-light)", textAlign: "center", marginTop: 12 }}>
            Secure checkout powered by Stripe. Cancel anytime.
          </p>
        </Card>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="/pricing" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 500, textDecoration: "none" }}>
            &larr; Back to pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
