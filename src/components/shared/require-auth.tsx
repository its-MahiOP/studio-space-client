"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useAuth } from "@/components/providers/auth-provider";

export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, ready } = useAuth();

  useEffect(() => {
    if (ready && !user) {
      router.replace("/login");
    }
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <div className="shell flex min-h-[55vh] items-center justify-center py-20">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto size-10 animate-pulse rounded-full bg-paper-deep" />
          <p className="mt-5 text-[13px] text-muted-ink">
            {ready ? "Taking you to sign in…" : "Opening your workspace…"}
          </p>
          <Link
            href="/login"
            className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-ink underline decoration-sodium decoration-2 underline-offset-4"
          >
            Sign in now
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
