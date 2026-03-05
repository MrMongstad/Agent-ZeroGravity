import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle high-value events
    switch (event.type) {
        case "checkout.session.completed":
            const session = event.data.object as Stripe.Checkout.Session;
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

            // Update member status in Supabase
            const { error } = await supabaseAdmin
                .from("members")
                .upsert({
                    email: session.customer_details?.email,
                    stripe_customer_id: session.customer as string,
                    stripe_subscription_id: subscription.id,
                    tier: subscription.items.data[0].price.nickname || "GHOST",
                    status: "active",
                });

            if (error) console.error("Supabase Sync Error:", error);
            break;

        case "customer.subscription.deleted":
            const deletedSub = event.data.object as Stripe.Subscription;
            await supabaseAdmin
                .from("members")
                .update({ status: "canceled" })
                .eq("stripe_subscription_id", deletedSub.id);
            break;
    }

    return NextResponse.json({ received: true });
}
