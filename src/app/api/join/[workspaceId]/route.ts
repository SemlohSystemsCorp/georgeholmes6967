import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const { workspaceId } = await params;
    const adminClient = createAdminClient();

    const { data: org } = await adminClient
      .from("organizations")
      .select("id, name, invite_code")
      .eq("invite_code", workspaceId)
      .single();

    if (!org) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const { count } = await adminClient
      .from("organization_members")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", org.id);

    return NextResponse.json({ name: org.name, memberCount: count || 0 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const { workspaceId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const adminClient = createAdminClient();

    const { data: org } = await adminClient
      .from("organizations")
      .select("id")
      .eq("invite_code", workspaceId)
      .single();

    if (!org) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    // Check if already a member
    const { data: existing } = await adminClient
      .from("organization_members")
      .select("id")
      .eq("organization_id", org.id)
      .eq("user_id", user.id)
      .single();

    if (existing) {
      return NextResponse.json({ success: true, alreadyMember: true });
    }

    await adminClient
      .from("organization_members")
      .insert({
        organization_id: org.id,
        user_id: user.id,
        role: "member",
      });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
