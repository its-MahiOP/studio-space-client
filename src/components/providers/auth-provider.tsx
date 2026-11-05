"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface DemoUser {
  name: string;
  email: string;
  avatar: string;
  role: string;
}

interface AuthContextValue {
  user: DemoUser | null;
  ready: boolean;
  signIn: (options?: { email?: string; name?: string }) => void;
  signOut: () => void;
}

const STORAGE_KEY = "studiospace.demo-user";

export const DEMO_USER: DemoUser = {
  name: "Ava Chen",
  email: "ava@studiospace.demo",
  avatar: "/images/avatars/ava.jpg",
  role: "Creator & host",
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DemoUser;
        if (parsed?.email) {
          // Hydrate the demo session once from localStorage after mount.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setUser(parsed);
        }
      }
    } catch {
      // Demo-only persistence; a blocked storage API should not break the UI.
    } finally {
      setReady(true);
    }
  }, []);

  const signIn = useCallback((options?: { email?: string; name?: string }) => {
    const email = options?.email?.trim() || DEMO_USER.email;
    const name = options?.name?.trim() || DEMO_USER.name;
    const nextUser: DemoUser = {
      ...DEMO_USER,
      name,
      email,
      role: name === DEMO_USER.name ? DEMO_USER.role : "Creator",
    };

    setUser(nextUser);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } catch {
      // Ignore storage failures in the demo.
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage failures in the demo.
    }
  }, []);

  const value = useMemo(
    () => ({ user, ready, signIn, signOut }),
    [user, ready, signIn, signOut],
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
