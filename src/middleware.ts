import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Si l'utilisateur n'a pas de token et qu'il essaie d'accéder à une page privée
  if (!token && req.nextUrl.pathname.startsWith("/app")) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Sinon, on laisse passer la requête
  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"], // middleware s'applique uniquement aux routes commençant par /app
};
