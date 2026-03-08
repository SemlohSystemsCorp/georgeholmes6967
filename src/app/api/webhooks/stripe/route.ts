import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend } from "@/lib/resend";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan || "pro";
      const userEmail = session.metadata?.userEmail || "";
      const userName = session.metadata?.userName || "";

      const organizationId = session.metadata?.organizationId;

      if (userId && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const billingAnchor = subscription.billing_cycle_anchor;

        // Determine which org to associate — use metadata org or find user's first org
        let orgId = organizationId;
        if (!orgId) {
          const { data: membership } = await supabase
            .from("organization_members")
            .select("organization_id")
            .eq("user_id", userId)
            .limit(1)
            .single();
          orgId = membership?.organization_id;
        }

        if (orgId) {
          // Upsert subscription in database
          await supabase.from("subscriptions").upsert({
            organization_id: orgId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscription.id,
            plan,
            status: "active",
            current_period_end: new Date(billingAnchor * 1000).toISOString(),
          }, { onConflict: "stripe_subscription_id" });

          // Update the organization's plan (triggers realtime for dashboard)
          await supabase
            .from("organizations")
            .update({ plan })
            .eq("id", orgId);
        }

        // Send confirmation email
        if (userEmail) {
          const nextBillingDate = new Date(billingAnchor * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
          await resend.emails.send({
            from: "Chatterbox <emails@georgeholmes.io>",
            to: userEmail,
            subject: "Your Chatterbox subscription is active",
            html: `
              <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
                <div style="margin-bottom: 32px;">
                  <span style="font-size: 20px; font-weight: 700; color: #0A2540;">Chatterbox</span>
                </div>
                <h1 style="font-size: 24px; font-weight: 700; color: #0A2540; margin: 0 0 8px 0;">
                  Subscription confirmed
                </h1>
                <p style="font-size: 14px; color: #425466; margin: 0 0 24px 0; line-height: 1.6;">
                  Hi${userName ? ` ${userName}` : ""}, your <strong>${plan.charAt(0).toUpperCase() + plan.slice(1)}</strong> plan is now active. You have access to all ${plan} features.
                </p>
                <div style="background: #F6F9FC; border: 1px solid #E1E4E8; border-radius: 4px; padding: 16px; margin-bottom: 24px;">
                  <p style="font-size: 13px; color: #425466; margin: 0 0 4px 0;"><strong>Plan:</strong> ${plan.charAt(0).toUpperCase() + plan.slice(1)}</p>
                  <p style="font-size: 13px; color: #425466; margin: 0;"><strong>Next billing date:</strong> ${nextBillingDate}</p>
                </div>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: #635BFF; color: #FFFFFF; font-size: 14px; font-weight: 600; padding: 10px 24px; border-radius: 4px; text-decoration: none;">
                  Go to Dashboard
                </a>
                <p style="font-size: 13px; color: #68778D; margin: 24px 0 0 0; line-height: 1.5;">
                  You can manage your subscription anytime from your account settings.
                </p>
              </div>
            `,
          });
        }
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const status = subscription.status === "active" ? "active"
        : subscription.status === "past_due" ? "past_due"
        : subscription.status === "canceled" ? "canceled"
        : subscription.status === "trialing" ? "trialing"
        : "active";

      await supabase
        .from("subscriptions")
        .update({
          status,
          current_period_end: new Date(subscription.billing_cycle_anchor * 1000).toISOString(),
        })
        .eq("stripe_subscription_id", subscription.id);

      // If canceled or past_due, update org plan back to free
      if (status === "canceled") {
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("organization_id")
          .eq("stripe_subscription_id", subscription.id)
          .single();
        if (sub?.organization_id) {
          await supabase.from("organizations").update({ plan: "free" }).eq("id", sub.organization_id);
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      // Find the org before updating
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("organization_id")
        .eq("stripe_subscription_id", subscription.id)
        .single();

      await supabase
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("stripe_subscription_id", subscription.id);

      // Revert org plan to free
      if (sub?.organization_id) {
        await supabase.from("organizations").update({ plan: "free" }).eq("id", sub.organization_id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
