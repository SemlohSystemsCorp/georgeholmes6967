import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Use admin client for data fetching to bypass RLS
  // (user is already authenticated via supabase.auth.getUser above)
  const admin = createAdminClient();

  // Fetch user profile
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("username, full_name, avatar_url")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("[dashboard] Profile query failed:", {
      message: profileError.message,
      code: profileError.code,
      details: profileError.details,
      hint: profileError.hint,
      userId: user.id,
    });
  }

  // Check if user needs onboarding
  if (!profile?.username) {
    redirect("/onboarding");
  }

  // Fetch user's workspaces
  const { data: memberships, error: membError } = await admin
    .from("organization_members")
    .select("organization_id, role, organizations(id, name, slug, plan, invite_code)")
    .eq("user_id", user.id);

  if (membError) {
    console.error("[dashboard] Memberships query failed:", {
      message: membError.message,
      code: membError.code,
      details: membError.details,
      hint: membError.hint,
      userId: user.id,
    });
  }

  const workspaces = memberships?.map((m) => {
    const org = m.organizations as unknown as { id: string; name: string; slug: string; plan: string; invite_code: string } | null;
    return {
      id: org?.id || "",
      name: org?.name || "",
      slug: org?.slug || "",
      plan: org?.plan || "free",
      inviteCode: org?.invite_code || "",
      role: m.role as string,
    };
  }).filter((w) => w.id) || [];

  return (
    <DashboardClient
      user={{
        id: user.id,
        email: user.email || "",
        fullName: profile.full_name || user.user_metadata?.full_name || "",
        username: profile.username || "",
        avatarUrl: profile.avatar_url || "",
      }}
      initialWorkspaces={workspaces}
    />
  );
}
