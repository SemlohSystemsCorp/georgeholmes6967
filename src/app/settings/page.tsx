"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError) {
        console.error("[settings] Auth error:", authError.message);
      }
      if (!user) { router.push("/login"); return; }

      setEmail(user.email || "");
      setFullName(user.user_metadata?.full_name || "");

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("[settings] Profile query failed:", {
          message: profileError.message,
          code: profileError.code,
          details: profileError.details,
          hint: profileError.hint,
        });
      }

      if (profile?.username) setUsername(profile.username);
      setLoading(false);
    }
    loadProfile();
  }, [router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const supabase = createClient();

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      });

      if (updateError) { setError(updateError.message); setSaving(false); return; }

      // Update profile username
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ full_name: fullName, username: username.trim().toLowerCase() })
          .eq("id", user.id);

        if (profileError) {
          setError(profileError.message.includes("unique") ? "This username is already taken." : profileError.message);
          setSaving(false);
          return;
        }
      }

      setMessage("Settings saved successfully.");
    } catch {
      setError("Something went wrong.");
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: 14, color: "var(--body)" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)" }}>
      <nav style={{ backgroundColor: "var(--surface)", borderBottom: "1px solid var(--border)", height: 60, display: "flex", alignItems: "center", padding: "0 24px", justifyContent: "space-between" }}>
        <Logo />
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">Dashboard</Button>
          </Link>
          <form action="/api/auth/signout" method="POST">
            <Button variant="ghost" size="sm" type="submit">Sign Out</Button>
          </form>
        </div>
      </nav>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 24px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--heading)", marginBottom: 24 }}>Settings</h2>

        <Card>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--heading)", marginBottom: 16 }}>Profile</h3>
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Full name" type="text" value={fullName} onChange={(e) => { setFullName(e.target.value); setMessage(""); setError(""); }} />
            <Input label="Username" type="text" value={username} onChange={(e) => { setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, "")); setMessage(""); setError(""); }} />
            <Input label="Email" type="email" value={email} disabled />

            {error && (
              <div style={{ fontSize: 13, color: "var(--error)", backgroundColor: "var(--error-light)", border: "1px solid rgba(229,107,107,0.2)", borderRadius: "var(--radius)", padding: "8px 12px" }}>
                {error}
              </div>
            )}
            {message && (
              <div style={{ fontSize: 13, color: "var(--success)", backgroundColor: "#e6f9f0", border: "1px solid rgba(0,208,132,0.2)", borderRadius: "var(--radius)", padding: "8px 12px" }}>
                {message}
              </div>
            )}

            <Button type="submit" loading={saving}>Save Changes</Button>
          </form>
        </Card>

        <div style={{ marginTop: 24 }}>
          <Card>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--heading)", marginBottom: 16 }}>Password</h3>
            <p style={{ fontSize: 14, color: "var(--body)", marginBottom: 16 }}>
              Change your password via the reset flow.
            </p>
            <Link href="/forgot-password">
              <Button variant="secondary" size="sm">Reset Password</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
