import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";

export default async function WelcomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const firstName = user.user_metadata?.full_name?.split(" ")[0] || "there";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 16px" }}>
      <div style={{ marginBottom: 32 }}>
        <Logo size="lg" />
      </div>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <Card>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
              </svg>
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--heading)", marginBottom: 8 }}>
              Welcome, {firstName}!
            </h2>
            <p style={{ fontSize: 14, color: "var(--body)", lineHeight: 1.6 }}>
              Your account is ready. Set up your workspace to get the most out of Chatterbox, or jump straight in.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Link href="/onboarding" style={{ textDecoration: "none" }}>
              <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", transition: "background-color var(--transition)" }}>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--heading)", marginBottom: 2 }}>
                    Set up your workspace
                  </h4>
                  <p style={{ fontSize: 13, color: "var(--body-light)" }}>
                    Create your organization, invite your team, and configure channels.
                  </p>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--body-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginLeft: 16 }}>
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </Link>

            <Link href="/dashboard" style={{ textDecoration: "none" }}>
              <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", transition: "background-color var(--transition)" }}>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--heading)", marginBottom: 2 }}>
                    Go to dashboard
                  </h4>
                  <p style={{ fontSize: 13, color: "var(--body-light)" }}>
                    Skip setup and start using Chatterbox right away.
                  </p>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--body-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginLeft: 16 }}>
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
