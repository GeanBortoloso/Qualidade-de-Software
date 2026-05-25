import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getSessionFromRequest,
  painelPathForPerfil,
  SESSION_COOKIE,
} from "./lib/auth";

const PROTECTED_PREFIXES = ["/painel"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSessionFromRequest(request);

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isLogin = pathname === "/login";

  if (isProtected && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLogin && session) {
    return NextResponse.redirect(
      new URL(painelPathForPerfil(session.perfil), request.url)
    );
  }

  if (isProtected && session) {
    const expected = painelPathForPerfil(session.perfil);
    if (pathname !== expected && pathname.startsWith("/painel/")) {
      return NextResponse.redirect(new URL(expected, request.url));
    }
  }

  const response = NextResponse.next();
  if (session) {
    response.headers.set("x-user-perfil", session.perfil);
  }
  return response;
}

export const config = {
  matcher: ["/login", "/painel/:path*"],
};
