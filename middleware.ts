import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session/edge";

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();
  const session:any = await getIronSession(req, res, {
    cookieName: "myapp_cookiename",
    password: "complex_password_at_least_32_characters_long",
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  });

  const username = (session?.user as any)?.username || "";
  const password = (session?.user as any)?.password || "";

  // demo:
  if (username === "") {
    // unauthorized to see pages inside admin/
    return NextResponse.redirect(new URL('/login', req.url)) // redirect to /unauthorized page
  }

  return res;
};

export const config = {
  matcher: '/((?!login|api/login|_next/static|favicon.ico).*)',
};
