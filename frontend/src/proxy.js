import { NextResponse } from "next/server";

const PROTECTED = /^\/(admin|teacher|student|parent)(\/|$)/;

export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (PROTECTED.test(pathname)) {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/teacher/:path*", "/student/:path*", "/parent/:path*"],
};
