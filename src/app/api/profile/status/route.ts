import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const admin = createAdminClient();

    const { data: profile } = await admin
      .from("profiles")
      .select("username, full_name, avatar_url")
      .eq("id", user.id)
      .single();

    const { data: memberships } = await admin
      .from("organization_members")
      .select("id")
      .eq("user_id", user.id)
      .limit(1);

    return NextResponse.json({
      email: user.email || null,
      username: profile?.username || null,
      fullName: profile?.full_name || user.user_metadata?.full_name || null,
      avatarUrl: profile?.avatar_url || null,
      hasWorkspace: !!(memberships && memberships.length > 0),
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
