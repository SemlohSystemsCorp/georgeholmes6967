"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <>
      <Card>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--heading)", marginBottom: 4 }}>Welcome back</h3>
        <p style={{ fontSize: 13, color: "var(--body-light)", marginBottom: 24 }}>Log in to your Chatterbox account.</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Email address" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          {error && (
            <div style={{ fontSize: 13, color: "var(--error)", backgroundColor: "var(--error-light)", border: "1px solid rgba(229,107,107,0.2)", borderRadius: "var(--radius)", padding: "8px 12px" }}>
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} fullWidth>Log In</Button>
        </form>

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <Link href="/forgot-password" style={{ fontSize: 13, color: "var(--primary)" }}>Forgot your password?</Link>
        </div>
      </Card>

      <p style={{ textAlign: "center", fontSize: 13, color: "var(--body-light)", marginTop: 20 }}>
        Don&apos;t have an account?{" "}
        <Link href="/signup" style={{ color: "var(--primary)", fontWeight: 500 }}>Sign up</Link>
      </p>
    </>
  );
}
