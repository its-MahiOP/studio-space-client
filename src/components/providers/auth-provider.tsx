"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

export interface AuthUser {
  name: string;
  email: string;
  avatar: string;
  role: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  /** True until the BetterAuth session has been resolved (or confirmed absent). */
  ready: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  const user = useMemo<AuthUser | null>(() => {
    const sessionUser = data?.user;
    if (!sessionUser) return null;

    return {
      name: sessionUser.name,
      email: sessionUser.email,
      avatar: sessionUser.image ?? "",
      role: "StudioSpace member",
    };
  }, [data]);

  // Challenge 1: while a session is active, keep the HTTPOnly API JWT cookie
  // fresh so the Express server keeps accepting our mutations. The cookie is
  // HttpOnly, so this code only triggers issuance — it can never read it.
  useEffect(() => {
    if (!user) return;

    const syncApiToken = () => {
      fetch("/api/auth-token", { credentials: "same-origin" }).catch(() => {
        // Offline or mid-rebuild: the 401 retry in the API layer recovers.
      });
    };

    syncApiToken();
    const intervalId = window.setInterval(syncApiToken, 10 * 60 * 1000);
    return () => window.clearInterval(intervalId);
  }, [user]);

  const signOut = useCallback(async () => {
    await authClient.signOut();
    // Drop the API JWT cookie so mutations stop being authorized immediately.
    fetch("/api/auth-token", { method: "DELETE", credentials: "same-origin" }).catch(
      () => undefined,
    );
    toast.add({
      type: "success",
      title: "Signed out",
      description: "You've been signed out on this device. See you soon.",
    });
    router.refresh();
  }, [router]);

  const value = useMemo(
    () => ({ user, ready: !isPending, signOut }),
    [user, isPending, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }

  return context;
}
