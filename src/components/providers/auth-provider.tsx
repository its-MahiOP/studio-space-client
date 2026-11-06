"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

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

  const signOut = useCallback(async () => {
    await authClient.signOut();
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
