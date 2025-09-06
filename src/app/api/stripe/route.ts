import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  console.log(body);

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("Missing Stripe webhook secret in environment variables");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  if (!signature) {
    console.log("No Stripe signature found in headers");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // Verify webhook from Stripe
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log("Webhook verification failed", error);
    return NextResponse.json(null, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      const email = event.data?.object?.customer_email;
      console.log(email);

      if (!email) {
        return NextResponse.json(
          { error: "No customer email in webhook" },
          { status: 400 }
        );
      }

      // Met à jour l'accès de l'utilisateur
      const user = await prisma.user.update({
        where: { email },
        data: { hasAccess: true },
        select: { email: true, hasAccess: true }, // 🔥 assure que tu le vois bien
      });
      console.log("Webhook updated user:", user);
      break;
    default:
    // console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
