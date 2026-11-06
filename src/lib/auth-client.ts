import { createAuthClient } from "better-auth/react";

/**
 * Single auth client for the whole app.
 *
 * The BetterAuth API is served by this Next.js app at `/api/auth`, so the
 * client always talks to the current origin (no cross-origin base URL).
 * Sharing one instance keeps the session store in sync across every
 * `useSession()` consumer (header, auth guard, forms).
 */
export const authClient = createAuthClient();
