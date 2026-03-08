import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateUsername, generateWorkspaceId } from "@/lib/email-validate";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { username, workspaceName } = await request.json();

    const adminClient = createAdminClient();

    // Check if user already has a username
    const { data: currentProfile } = await adminClient
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    if (!currentProfile?.username) {
      // First time — validate and set username
      const usernameCheck = validateUsername(username);
      if (!usernameCheck.valid) {
        return NextResponse.json({ error: usernameCheck.error }, { status: 400 });
      }

      // Check username uniqueness
      const { data: existingUser } = await adminClient
        .from("profiles")
        .select("id")
        .eq("username", username.trim().toLowerCase())
        .single();

      if (existingUser) {
        return NextResponse.json({ error: "This username is already taken." }, { status: 409 });
      }

      // Update profile with username
      await adminClient
        .from("profiles")
        .update({ username: username.trim().toLowerCase() })
        .eq("id", user.id);
    }

    // Create workspace if name provided
    let workspaceId: string | null = null;
    if (workspaceName && workspaceName.trim()) {
      const slug = `workspace/${generateWorkspaceId()}`;
      const inviteCode = generateWorkspaceId();

      const { data: org, error: orgError } = await adminClient
        .from("organizations")
        .insert({
          name: workspaceName.trim(),
          slug,
          owner_id: user.id,
          invite_code: inviteCode,
          plan: "free",
        })
        .select("id, slug, invite_code")
        .single();

      if (orgError) {
        return NextResponse.json({ error: "Failed to create workspace." }, { status: 500 });
      }

      // Add user as owner member
      await adminClient
        .from("organization_members")
        .insert({
          organization_id: org.id,
          user_id: user.id,
          role: "owner",
        });

      // Create a default #general channel
      await adminClient
        .from("channels")
        .insert({
          organization_id: org.id,
          name: "general",
          description: "General discussion",
          created_by: user.id,
        });

      workspaceId = org.slug;
    }

    return NextResponse.json({ success: true, workspaceId });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
