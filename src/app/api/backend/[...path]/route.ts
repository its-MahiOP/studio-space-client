import type { NextRequest } from "next/server";

/**
 * Same-origin proxy to the StudioSpace Express API.
 *
 * Why this exists: the JWT that authorizes server-side mutations is stored in
 * an HTTPOnly cookie set on this app's own host. Cookies are host-scoped, so
 * if the browser called a second deployment (e.g. another *.vercel.app host)
 * directly, the cookie would never be sent and every mutation would 401.
 * Routing all API traffic through this handler keeps the browser on a single
 * origin: the cookie is attached here, then forwarded server-side to the data
 * API — the page's JavaScript still can't read it (Challenge 1 preserved).
 */
const BACKEND_ORIGIN = (
  process.env.SERVER_BASE_URL ?? "http://localhost:5000"
).replace(/\/+$/, "");

/** End-to-end headers only; hop-by-hop headers are handled by fetch itself. */
const FORWARDED_REQUEST_HEADERS = ["cookie", "content-type", "accept"] as const;
const FORWARDED_RESPONSE_HEADERS = ["content-type", "cache-control"] as const;

async function proxyRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
): Promise<Response> {
  const { path } = await params;
  const target = `${BACKEND_ORIGIN}/${path.join("/")}${request.nextUrl.search}`;

  const headers = new Headers();
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: "no-store",
    redirect: "manual",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, init);
  } catch {
    // The data API is unreachable — surface it as a JSON error so the client's
    // normal error path (toast/empty state) still works.
    return Response.json(
      {
        success: false,
        message: "Could not reach the StudioSpace API. Is the server running?",
      },
      { status: 502 },
    );
  }

  const responseHeaders = new Headers();
  for (const name of FORWARDED_RESPONSE_HEADERS) {
    const value = upstream.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export {
  proxyRequest as GET,
  proxyRequest as POST,
  proxyRequest as PUT,
  proxyRequest as PATCH,
  proxyRequest as DELETE,
};
