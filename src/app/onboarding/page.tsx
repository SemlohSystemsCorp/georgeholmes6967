"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { validateUsername } from "@/lib/email-validate";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [hasUsername, setHasUsername] = useState(false);

  // Check if user already completed onboarding
  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      if (profile?.username) {
        // Check if they also have a workspace
        const { data: memberships } = await supabase
          .from("organization_members")
          .select("id")
          .eq("user_id", user.id)
          .limit(1);

        if (memberships && memberships.length > 0) {
          // Fully onboarded — go to dashboard
          router.push("/dashboard");
          return;
        }

        // Has username but no workspace — skip to step 2
        setUsername(profile.username);
        setHasUsername(true);
        setStep(2);
      }
      setChecking(false);
    }
    check();
  }, [router]);

  function handleUsernameChange(val: string) {
    setUsername(val.toLowerCase().replace(/[^a-z0-9._-]/g, ""));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (step === 1) {
      const check = validateUsername(username);
      if (!check.valid) { setError(check.error!); return; }
      setStep(2);
      return;
    }

    if (!workspaceName.trim()) {
      setError("Workspace name is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, workspaceName: workspaceName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); setLoading(false); return; }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: 14, color: "var(--body)" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 16px" }}>
      <div style={{ marginBottom: 32 }}>
        <Logo size="lg" />
      </div>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <Card>
          {/* Progress */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: "var(--primary)" }} />
            <div style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: step >= 2 ? "var(--primary)" : "var(--border)" }} />
          </div>

          {step === 1 ? (
            <>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--heading)", marginBottom: 4 }}>Choose a username</h3>
              <p style={{ fontSize: 13, color: "var(--body-light)", marginBottom: 24 }}>This is how others will find and mention you.</p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <Input
                    label="Username"
                    type="text"
                    placeholder="janedoe"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    required
                  />
                  {username && !error && (
                    <p style={{ fontSize: 12, color: "var(--body-light)", marginTop: 4 }}>
                      You&apos;ll be known as <strong style={{ color: "var(--heading)" }}>@{username}</strong>
                    </p>
                  )}
                </div>

                {error && (
                  <div style={{ fontSize: 13, color: "var(--error)", backgroundColor: "var(--error-light)", border: "1px solid rgba(229,107,107,0.2)", borderRadius: "var(--radius)", padding: "8px 12px" }}>
                    {error}
                  </div>
                )}

                <Button type="submit" fullWidth>Continue</Button>
              </form>
            </>
          ) : (
            <>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--heading)", marginBottom: 4 }}>Create your workspace</h3>
              <p style={{ fontSize: 13, color: "var(--body-light)", marginBottom: 24 }}>A workspace is where your team communicates. You can create more later.</p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Input
                  label="Workspace name"
                  type="text"
                  placeholder="Acme Inc."
                  value={workspaceName}
                  onChange={(e) => { setWorkspaceName(e.target.value); setError(""); }}
                  required
                />

                {error && (
                  <div style={{ fontSize: 13, color: "var(--error)", backgroundColor: "var(--error-light)", border: "1px solid rgba(229,107,107,0.2)", borderRadius: "var(--radius)", padding: "8px 12px" }}>
                    {error}
                  </div>
                )}

                <Button type="submit" loading={loading} fullWidth>Create Workspace</Button>
                {!hasUsername && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{ fontSize: 13, color: "var(--primary)", fontWeight: 500, cursor: "pointer", background: "none", border: "none", fontFamily: "inherit" }}
                  >
                    &larr; Back
                  </button>
                )}
              </form>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
