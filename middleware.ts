// middleware.ts à la racine

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth(req => {
  const { nextUrl } = req;
  const isAuthRoute = nextUrl.pathname.startsWith("/app");
  const isPublicRoute = !isAuthRoute;

  // Si l'utilisateur n'est pas authentifié et tente d'accéder à une route privée
  if (!req.auth && isAuthRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Si l'utilisateur est authentifié et tente d'accéder à une route publique
  if (req.auth && isPublicRoute) {
    return NextResponse.redirect(new URL("/app/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/", "/login", "/signup", "/app/:path*"],
};
