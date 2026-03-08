import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const validPlans = ["pro", "enterprise"] as const;

const priceIds: Record<string, string | undefined> = {
  pro: process.env.STRIPE_PRO_PRICE_ID,
  enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID,
};

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { plan, organizationId } = body;

    if (!plan || !validPlans.includes(plan)) {
      return NextResponse.json({ error: "Invalid plan. Choose pro or enterprise." }, { status: 400 });
    }

    const priceId = priceIds[plan];
    if (!priceId) {
      return NextResponse.json({ error: "This plan is not configured yet. Please contact support." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check if user already has an active subscription for this org
    if (organizationId) {
      const adminClient = createAdminClient();
      const { data: existingSub } = await adminClient
        .from("subscriptions")
        .select("id, plan, status")
        .eq("organization_id", organizationId)
        .in("status", ["active", "trialing"])
        .single();

      if (existingSub) {
        if (existingSub.plan === plan) {
          return NextResponse.json({ error: "You already have an active subscription on this plan." }, { status: 409 });
        }
        // Allow upgrading (enterprise > pro)
      }
    }

    // Check if there's already a Stripe customer for this email to reuse
    const customers = await stripe.customers.list({ email: user.email!, limit: 1 });
    const customerId = customers.data.length > 0 ? customers.data[0].id : undefined;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      ...(customerId ? { customer: customerId } : { customer_email: user.email }),
      metadata: {
        userId: user.id,
        plan,
        userEmail: user.email || "",
        userName: user.user_metadata?.full_name || "",
        ...(organizationId ? { organizationId } : {}),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
