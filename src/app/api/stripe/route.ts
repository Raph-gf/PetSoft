import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const event = await request.json();

  // Récupère correctement l'email du client
  const email = event.data?.object?.customer_email;

  if (!email) {
    return NextResponse.json(
      { error: "No customer email in webhook" },
      { status: 400 }
    );
  }

  // Met à jour l'accès de l'utilisateur
  await prisma.user.update({
    where: { email },
    data: { hasAccess: true },
  });

  return NextResponse.json({ received: true }, { status: 200 });
}
