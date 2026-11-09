import { NextResponse, type NextRequest } from "next/server";

/**
 * Challenge 1 — client-side protection (Next Proxy).
 *
 * Pages behind a sign-in wall are checked on the server before they render:
 * requests without a BetterAuth session cookie are redirected to /login with a
 * `redirect` query so the user lands back where they were headed. This is the
 * first line of defense; `RequireAuth` and the dashboard layout repeat the
 * check on the client for defense in depth.
 */

/**
 * BetterAuth prefixes its cookies with `__Secure-` whenever the origin is
 * HTTPS, so the same deployment serves a differently-named cookie than local
 * http://localhost:3000. Checking only the bare name logged every live user
 * out of the protected routes despite a valid session — accept either.
 */
const SESSION_COOKIE_NAMES = [
  "__Secure-better-auth.session_token",
  "better-auth.session_token",
] as const;

export function proxy(request: NextRequest) {
  const sessionToken = SESSION_COOKIE_NAMES.map(
    (name) => request.cookies.get(name)?.value,
  ).find(Boolean);

  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set(
      "redirect",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/add-studio/:path*",
    "/my-bookings/:path*",
    "/my-listings/:path*",
    "/studios/edit/:path*",
    "/wishlist/:path*",
  ],
};
