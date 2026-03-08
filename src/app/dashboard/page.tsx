import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  // Check if user needs onboarding
  if (!profile?.username) {
    redirect("/onboarding");
  }

  // Fetch user's workspaces
  const { data: memberships } = await supabase
    .from("organization_members")
    .select("organization_id, role, organizations(id, name, slug, plan)")
    .eq("user_id", user.id);

  const workspaces = memberships?.map((m) => {
    const org = m.organizations as unknown as { id: string; name: string; slug: string; plan: string } | null;
    return {
      id: org?.id || "",
      name: org?.name || "",
      slug: org?.slug || "",
      plan: org?.plan || "free",
      role: m.role,
    };
  }).filter((w) => w.id) || [];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)" }}>
      <nav style={{ backgroundColor: "var(--surface)", borderBottom: "1px solid var(--border)", height: 60, display: "flex", alignItems: "center", padding: "0 24px", justifyContent: "space-between" }}>
        <Logo />
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/settings">
            <Button variant="ghost" size="sm">Settings</Button>
          </Link>
          <form action="/api/auth/signout" method="POST">
            <Button variant="ghost" size="sm" type="submit">
              Sign Out
            </Button>
          </form>
        </div>
      </nav>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--heading)", marginBottom: 24 }}>
          Dashboard
        </h2>

        <Card>
          <p style={{ fontSize: 14, color: "var(--body)", marginBottom: 16 }}>
            Welcome, <span style={{ fontWeight: 500, color: "var(--heading)" }}>{user.user_metadata?.full_name || user.email}</span>.
            {profile?.username && <span style={{ color: "var(--body-light)" }}> (@{profile.username})</span>}
          </p>
        </Card>

        {/* Workspaces */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--heading)" }}>Workspaces</h3>
            <Link href="/onboarding">
              <Button variant="secondary" size="sm">Create Workspace</Button>
            </Link>
          </div>

          {workspaces.length === 0 ? (
            <Card>
              <p style={{ fontSize: 14, color: "var(--body)", textAlign: "center" }}>
                You don&apos;t have any workspaces yet.
              </p>
            </Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {workspaces.map((ws) => (
                <Card key={ws.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: "var(--radius)",
                        backgroundColor: "var(--primary-light)", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        fontSize: 18, fontWeight: 700, color: "var(--primary)",
                      }}>
                        {ws.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 600, color: "var(--heading)" }}>{ws.name}</p>
                        <p style={{ fontSize: 12, color: "var(--body-light)" }}>
                          {ws.role} &middot; {ws.plan === "free" ? "Hobby" : ws.plan === "pro" ? "Pro" : "Enterprise"} plan
                        </p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {ws.plan === "free" && (
                        <Link href="/checkout/pro">
                          <Button variant="secondary" size="sm">Upgrade</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div style={{ marginTop: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--heading)", marginBottom: 16 }}>Plans</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            <Link href="/checkout/pro" style={{ textDecoration: "none" }}>
              <Card>
                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--heading)", marginBottom: 4 }}>Pro Plan</p>
                <p style={{ fontSize: 13, color: "var(--body)" }}>$29/mo per org &middot; Unlimited history, video calls, advanced search</p>
              </Card>
            </Link>
            <Link href="/checkout/enterprise" style={{ textDecoration: "none" }}>
              <Card>
                <p style={{ fontSize: 15, fontWeight: 600, color: "var(--heading)", marginBottom: 4 }}>Enterprise Plan</p>
                <p style={{ fontSize: 13, color: "var(--body)" }}>$99/mo &middot; 500 GB storage, audit logs, SSO, dedicated infra</p>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
