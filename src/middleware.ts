import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isAuthRoute = req.nextUrl.pathname.startsWith("/app");
  const isPublicRoute = !isAuthRoute;

  if (!token && isAuthRoute) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/app/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/signup", "/app/:path*"],
};
