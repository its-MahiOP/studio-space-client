import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

/**
 * Name of the HTTPOnly cookie that carries the API JWT to the Express data
 * server. Cookies ignore ports, so localhost:3000 may set it and
 * localhost:5000 reads it from the Cookie header — but JavaScript on the page
 * never can, because the cookie is marked HttpOnly.
 */
const API_TOKEN_COOKIE = "studiospace_token";
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

/**
 * Issues the JWT used to authorize server-side mutations.
 *
 * Requires an active BetterAuth session (same-origin cookie), then asks the
 * JWT plugin the app already initializes to mint a token. The token is stored
 * in an HTTPOnly cookie so the browser sends it to the data API automatically
 * while client-side scripts stay unable to read or forge it.
 */
export async function GET() {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  const user = session?.user;

  if (!user) {
    const response = NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 },
    );
    response.cookies.delete(API_TOKEN_COOKIE);
    return response;
  }

  let token: string;
  try {
    // Preferred: a long-lived JWT signed by the plugin's JWKS key.
    const signed = await auth.api.signJWT({
      body: {
        payload: {
          sub: user.id,
          email: user.email,
          name: user.name,
          iat: Math.floor(Date.now() / 1000),
        },
        overrideOptions: {
          jwt: { expirationTime: "7d" },
        },
      },
    });
    token = signed.token;
  } catch {
    // Fallback: the plugin's standard session token.
    const result = await auth.api.getToken({ headers: headerList });
    token = result.token;
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(API_TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
  return response;
}

/** Clears the API JWT cookie when the user signs out. */
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(API_TOKEN_COOKIE);
  return response;
}
