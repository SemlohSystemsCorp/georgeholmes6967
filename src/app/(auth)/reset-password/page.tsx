"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const code = searchParams.get("code") || "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) { setError("Invalid or expired reset link. Please request a new one."); setLoading(false); return; }
      }

      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) { setError(updateError.message); setLoading(false); return; }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Card>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--heading)", marginBottom: 8 }}>Set new password</h3>
        <p style={{ fontSize: 14, color: "var(--body)" }}>Enter your new password below.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Input label="New password" type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} placeholder="At least 8 characters" />
        <Input label="Confirm password" type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }} placeholder="Confirm your password" />

        {error && (
          <div style={{ fontSize: 13, color: "var(--error)", backgroundColor: "var(--error-light)", border: "1px solid rgba(229,107,107,0.2)", borderRadius: "var(--radius)", padding: "8px 12px", marginBottom: 16, textAlign: "center" }}>
            {error}
          </div>
        )}

        <Button type="submit" loading={loading} fullWidth>
          Update Password
        </Button>
      </form>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Card><p style={{ fontSize: 14, color: "var(--body)", textAlign: "center" }}>Loading...</p></Card>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
