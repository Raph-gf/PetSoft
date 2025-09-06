// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // Lit le token NextAuth sans charger tes providers (Edge-safe)
  const userIsConnected = await getToken({
    req,
    // couvre v5 (AUTH_SECRET) et v4 (NEXTAUTH_SECRET)
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const { pathname } = req.nextUrl;

  console.log("Middleware token:", userIsConnected);

  const isAuthRoute = pathname.startsWith("/app");

  // Non connecté → bloque les routes privées
  if (!userIsConnected && isAuthRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (userIsConnected && isAuthRoute && !userIsConnected?.hasAccess) {
    return NextResponse.redirect(new URL("/payment", req.url));
  }

  if (userIsConnected && isAuthRoute && userIsConnected?.hasAccess) {
    return NextResponse.next();
  }

  if (
    userIsConnected &&
    (pathname.includes("/login") ||
      pathname.includes("/signup") ||
      pathname.includes("/payment")) &&
    userIsConnected?.hasAccess
  ) {
    return NextResponse.redirect(new URL("app/dashboard", req.url));
  }

  // Connecté → empêche l'accès aux routes publiques
  if (
    userIsConnected &&
    (pathname === "/" || pathname === "/login" || pathname === "/signup")
  ) {
    return NextResponse.redirect(new URL("/payment", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/payment", "/login", "/signup", "/app/:path*"],
};
