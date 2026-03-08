import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Check if user exists (don't reveal this to the client)
    const { data: users } = await supabase.auth.admin.listUsers();
    const userExists = users?.users?.some((u) => u.email === email);

    if (!userExists) {
      // Return success even if user doesn't exist (prevent enumeration)
      return NextResponse.json({ success: true });
    }

    // Generate reset link via Supabase
    const { data, error: linkError } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=/reset-password`,
      },
    });

    if (linkError || !data) {
      return NextResponse.json({ error: "Failed to generate reset link" }, { status: 500 });
    }

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?token_hash=${data.properties.hashed_token}&type=recovery&next=/reset-password`;

    // Send email via Resend
    const { error: emailError } = await resend.emails.send({
      from: "Chatterbox <emails@georgeholmes.io>",
      to: email,
      subject: "Reset your Chatterbox password",
      html: `
        <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
          <div style="margin-bottom: 32px;">
            <span style="font-size: 20px; font-weight: 700; color: #0A2540;">Chatterbox</span>
          </div>
          <h1 style="font-size: 24px; font-weight: 700; color: #0A2540; margin: 0 0 8px 0;">
            Reset your password
          </h1>
          <p style="font-size: 14px; color: #425466; margin: 0 0 24px 0; line-height: 1.6;">
            We received a request to reset your password. Click the button below to choose a new password.
          </p>
          <a href="${resetUrl}" style="display: inline-block; background: #635BFF; color: #FFFFFF; font-size: 14px; font-weight: 600; padding: 10px 24px; border-radius: 4px; text-decoration: none;">
            Reset Password
          </a>
          <p style="font-size: 13px; color: #68778D; margin: 24px 0 0 0; line-height: 1.5;">
            This link expires in 1 hour. If you didn't request a password reset, you can ignore this email.
          </p>
        </div>
      `,
    });

    if (emailError) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
