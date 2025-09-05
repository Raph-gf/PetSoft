// middleware.ts
import { auth } from "@/lib/auth-edge";
import { NextResponse } from "next/server";

interface AuthRequest {
  nextUrl: URL;
  auth?: unknown;
}

type AuthHandler = (req: AuthRequest) => NextResponse;

export default auth((req: AuthRequest): NextResponse => {
  const { nextUrl } = req;
  const isAuthRoute: boolean = nextUrl.pathname.startsWith("/app");
  const isPublicRoute: boolean = !isAuthRoute;

  if (!req.auth && isAuthRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (req.auth && isPublicRoute) {
    return NextResponse.redirect(new URL("/app/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/", "/login", "/signup", "/app/:path*"],
};
