import { redirect } from "next/navigation";
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

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)" }}>
      <nav style={{ backgroundColor: "var(--surface)", borderBottom: "1px solid var(--border)", height: 60, display: "flex", alignItems: "center", padding: "0 24px", justifyContent: "space-between" }}>
        <Logo />
        <form action="/api/auth/signout" method="POST">
          <Button variant="ghost" size="sm" type="submit">
            Sign Out
          </Button>
        </form>
      </nav>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--heading)", marginBottom: 24 }}>
          Dashboard
        </h2>
        <Card>
          <p style={{ fontSize: 14, color: "var(--body)" }}>
            Welcome, <span style={{ fontWeight: 500, color: "var(--heading)" }}>{user.user_metadata?.full_name || user.email}</span>.
            Your account is set up and ready to go.
          </p>
        </Card>
      </div>
    </div>
  );
}
