import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateUsername, generateWorkspaceId } from "@/lib/email-validate";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.log("[onboarding-api] No authenticated user");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    console.log("[onboarding-api] User:", user.id, user.email);

    const { username, workspaceName } = await request.json();
    console.log("[onboarding-api] Input:", { username, workspaceName });

    const adminClient = createAdminClient();

    // Check if user already has a username
    const { data: currentProfile, error: profileError } = await adminClient
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("[onboarding-api] Profile fetch error:", profileError.message, profileError.code);
    }

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
      const { error: updateError } = await adminClient
        .from("profiles")
        .update({ username: username.trim().toLowerCase() })
        .eq("id", user.id);

      if (updateError) {
        console.error("[onboarding-api] Username update error:", updateError.message, updateError.code);
        return NextResponse.json({ error: "Failed to set username." }, { status: 500 });
      }

      console.log("[onboarding-api] Username set:", username.trim().toLowerCase());
    } else {
      console.log("[onboarding-api] User already has username:", currentProfile.username);
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
        console.error("[onboarding-api] Org creation error:", orgError.message, orgError.code, orgError.details);
        return NextResponse.json({ error: "Failed to create workspace." }, { status: 500 });
      }

      console.log("[onboarding-api] Organization created:", org.id, org.slug);

      // Add user as owner member
      const { error: memberError } = await adminClient
        .from("organization_members")
        .insert({
          organization_id: org.id,
          user_id: user.id,
          role: "owner",
        });

      if (memberError) {
        console.error("[onboarding-api] Member insert error:", memberError.message, memberError.code);
      }

      // Create a default #general channel
      const { error: channelError } = await adminClient
        .from("channels")
        .insert({
          organization_id: org.id,
          name: "general",
          description: "General discussion",
          created_by: user.id,
        });

      if (channelError) {
        console.error("[onboarding-api] Channel creation error:", channelError.message, channelError.code);
      }

      workspaceId = org.slug;
    }

    console.log("[onboarding-api] Success, workspaceId:", workspaceId);
    return NextResponse.json({ success: true, workspaceId });
  } catch (err) {
    console.error("[onboarding-api] Unhandled error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
