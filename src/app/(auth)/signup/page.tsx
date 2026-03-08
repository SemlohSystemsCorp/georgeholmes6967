"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }
      sessionStorage.setItem("chatterbox_signup", JSON.stringify({ email, password, fullName }));
      router.push("/verify?email=" + encodeURIComponent(email));
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <Card>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--heading)", marginBottom: 4 }}>Create your account</h3>
        <p style={{ fontSize: 13, color: "var(--body-light)", marginBottom: 24 }}>Get started with Chatterbox for free.</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Full name" type="text" placeholder="Jane Smith" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <Input label="Email address" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />

          {error && (
            <div style={{ fontSize: 13, color: "var(--error)", backgroundColor: "var(--error-light)", border: "1px solid rgba(229,107,107,0.2)", borderRadius: "var(--radius)", padding: "8px 12px" }}>
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} fullWidth>Create Account</Button>
        </form>
      </Card>

      <p style={{ textAlign: "center", fontSize: 13, color: "var(--body-light)", marginTop: 20 }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "var(--primary)", fontWeight: 500 }}>Log in</Link>
      </p>
    </>
  );
}
