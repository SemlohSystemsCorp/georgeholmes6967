"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { setError("Email is required."); return; }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); setLoading(false); return; }
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <Card>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--heading)", marginBottom: 8 }}>Check your email</h3>
          <p style={{ fontSize: 14, color: "var(--body)", lineHeight: 1.6, marginBottom: 24 }}>
            If an account exists for <strong style={{ color: "var(--heading)" }}>{email}</strong>, we sent a password reset link.
          </p>
          <Link href="/login" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 500, textDecoration: "none" }}>
            Back to login
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--heading)", marginBottom: 8 }}>Reset your password</h3>
        <p style={{ fontSize: 14, color: "var(--body)" }}>Enter your email and we&apos;ll send you a reset link.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Input label="Email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="you@example.com" />

        {error && (
          <div style={{ fontSize: 13, color: "var(--error)", backgroundColor: "var(--error-light)", border: "1px solid rgba(229,107,107,0.2)", borderRadius: "var(--radius)", padding: "8px 12px", marginBottom: 16, textAlign: "center" }}>
            {error}
          </div>
        )}

        <Button type="submit" loading={loading} fullWidth style={{ marginBottom: 12 }}>
          Send Reset Link
        </Button>
      </form>

      <div style={{ textAlign: "center" }}>
        <Link href="/login" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 500, textDecoration: "none" }}>
          Back to login
        </Link>
      </div>
    </Card>
  );
}
