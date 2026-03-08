import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const { email, fullName } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Check if email is already registered
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const emailTaken = existingUsers?.users?.some((u) => u.email === email);
    if (emailTaken) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please log in instead." },
        { status: 409 }
      );
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Invalidate any existing codes for this email
    await supabase
      .from("verification_codes")
      .update({ used: true })
      .eq("email", email)
      .eq("used", false);

    // Insert new code
    const { error: insertError } = await supabase
      .from("verification_codes")
      .insert({
        email,
        code,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to generate verification code" },
        { status: 500 }
      );
    }

    // Send email via Resend
    const { error: emailError } = await resend.emails.send({
      from: "Chatterbox <emails@georgeholmes.io>",
      to: email,
      subject: "Your Chatterbox verification code",
      html: `
        <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
          <div style="margin-bottom: 32px;">
            <span style="font-size: 20px; font-weight: 700; color: #0A2540;">Chatterbox</span>
          </div>
          <h1 style="font-size: 24px; font-weight: 700; color: #0A2540; margin: 0 0 8px 0;">
            Verify your email
          </h1>
          <p style="font-size: 14px; color: #425466; margin: 0 0 24px 0; line-height: 1.6;">
            Hi${fullName ? ` ${fullName}` : ""}, enter this code to verify your email and finish creating your Chatterbox account.
          </p>
          <div style="background: #F6F9FC; border: 1px solid #E1E4E8; border-radius: 4px; padding: 20px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 32px; font-weight: 700; color: #0A2540; letter-spacing: 6px;">
              ${code}
            </span>
          </div>
          <p style="font-size: 13px; color: #68778D; margin: 0; line-height: 1.5;">
            This code expires in 10 minutes. If you didn't create an account, you can ignore this email.
          </p>
        </div>
      `,
    });

    if (emailError) {
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
