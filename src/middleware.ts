import { NextResponse } from "next/server";

export function middleware(req: Request) {
  console.log(req.url);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
