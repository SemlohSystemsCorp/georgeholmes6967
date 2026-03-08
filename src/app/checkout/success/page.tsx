"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import { CSSProperties } from "react";

const container: CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "var(--bg)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 16px",
};

export default function CheckoutSuccessPage() {
  return (
    <div style={container}>
      <div style={{ marginBottom: 32 }}>
        <Logo size="lg" />
      </div>
      <div style={{ maxWidth: 480, width: "100%" }}>
        <Card>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#e6f9f0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 700, color: "var(--heading)", marginBottom: 8 }}>
              You&apos;re all set!
            </h3>
            <p style={{ fontSize: 14, color: "var(--body)", lineHeight: 1.6, marginBottom: 24 }}>
              Your subscription is active. We&apos;ve sent a confirmation email with your plan details.
            </p>
            <Link href="/dashboard">
              <Button size="lg" fullWidth>Go to Dashboard</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
