import { auth } from "./lib/auth";
// export function middleware(req: Request) {
//   console.log(req.url);
//   return NextResponse.next();
// }

export default auth;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
