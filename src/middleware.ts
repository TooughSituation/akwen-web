import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * Middleware = strażnik przy drzwiach (jak Form_Open w Access sprawdzający login).
 * Chroni /b2b/* oprócz /b2b/login. API produktów zostaje publiczne (katalog).
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  const isB2B = pathname.startsWith("/b2b");
  const isLogin = pathname === "/b2b/login" || pathname.startsWith("/b2b/login/");
  const isAuthApi = pathname.startsWith("/api/auth");

  if (isAuthApi) {
    return NextResponse.next();
  }

  // Zalogowany na /b2b/login → dashboard
  if (isLogin && isLoggedIn) {
    return NextResponse.redirect(new URL("/b2b", req.url));
  }

  // Niezalogowany na chronionej trasie B2B → login
  if (isB2B && !isLogin && !isLoggedIn) {
    const loginUrl = new URL("/b2b/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/b2b/:path*",
    // Nie blokujemy /api/products — publiczny katalog do search
    // /api/orders i /api/profile mogą działać bez sesji (mock), ale UI wymaga logowania
  ],
};
