"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "cn";
import {
  ArrowRightIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserIcon,
} from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";

const demoEmail = "ava@studiospace.demo";
const demoPassword = "studio123";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { signIn } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState(mode === "login" ? demoEmail : "");
  const [password, setPassword] = useState(mode === "login" ? demoPassword : "");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isLogin = mode === "login";

  function complete(nextName?: string, nextEmail?: string) {
    signIn({ name: nextName, email: nextEmail });
    router.push("/dashboard");
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isLogin && name.trim().length < 2) {
      setError("Tell us what to call you — at least two characters.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("That email doesn't look right. Try name@studio.com.");
      return;
    }
    if (password.length < 6) {
      setError("Passwords need at least six characters in the demo.");
      return;
    }
    if (!isLogin && !agreed) {
      setError("Please accept the terms to create a demo account.");
      return;
    }

    setSubmitting(true);
    complete(isLogin ? undefined : name.trim(), email.trim());
  }

  return (
    <section className="grid min-h-[calc(100svh-70px)] lg:grid-cols-[1.05fr_1fr]">
      <div className="grain grain-dark relative hidden overflow-hidden bg-ink text-paper lg:block">
        <Image
          src="/images/hero/hero-podcast.jpg"
          alt="A warm podcast studio with two chairs and microphones."
          fill
          priority
          sizes="50vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />
        <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
          <p className="eyebrow flex items-center gap-3 text-paper/55">
            <span className="inline-block size-1.5 bg-sodium" />
            StudioSpace / Members
          </p>

          <div className="max-w-md">
            <p className="font-display text-[clamp(2.2rem,3.4vw,3.4rem)] leading-[0.98] tracking-[-0.03em]">
              The room is
              <br />
              <span className="italic text-sodium">waiting for you.</span>
            </p>
            <p className="mt-5 text-[13px] leading-7 text-paper/55">
              Book studios, track your shoots and list your own space. One
              account for both sides of the marketplace.
            </p>

            <div className="mt-8 space-y-3 border-t border-paper/16 pt-5">
              {[
                "Instant booking on 60% of rooms",
                "$1M liability cover included",
                "Free changes up to 72 hours out",
              ].map((item) => (
                <p
                  key={item}
                  className="flex items-center gap-2.5 text-[12px] text-paper/62"
                >
                  <CheckIcon className="size-3.5 text-sodium" />
                  {item}
                </p>
              ))}
            </div>
          </div>

          <figure className="max-w-sm border-t border-paper/16 pt-5">
            <blockquote className="text-[13px] leading-6 text-paper/65">
              “I found a cyc wall two blocks from my apartment. It had been
              there for six years and I&apos;d never seen it.”
            </blockquote>
            <figcaption className="mt-3 text-[10px] tracking-[0.14em] text-paper/40 uppercase">
              Ava Chen · Photographer
            </figcaption>
          </figure>
        </div>
      </div>

      <div className="flex items-center justify-center bg-paper px-5 py-14 sm:px-8">
        <div className="w-full max-w-[420px]">
          <p className="eyebrow flex items-center gap-3 text-muted-ink">
            <span className="inline-block size-1.5 bg-clay" />
            {isLogin ? "Welcome back" : "Create an account"}
          </p>
          <h1 className="display-lg mt-4">
            {isLogin ? (
              <>
                Sign in to
                <br />
                <span className="italic text-clay">your studios.</span>
              </>
            ) : (
              <>
                Start with
                <br />
                <span className="italic text-clay">a room.</span>
              </>
            )}
          </h1>
          <p className="mt-4 text-[13px] leading-6 text-muted-ink">
            {isLogin
              ? "This is a demo. The credentials are prefilled — sign in and explore the host dashboard."
              : "Create a demo account to book rooms and list your own space. No card, no email confirmation."}
          </p>

          <div className="mt-6 rounded-2xl border border-sodium/45 bg-sodium/10 p-4">
            <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] text-ink uppercase">
              <SparklesIcon className="size-3.5 text-clay" />
              Demo account
            </p>
            <p className="mt-2 text-[12px] leading-5 text-ink/68">
              {demoEmail} · {demoPassword}
            </p>
            <button
              type="button"
              onClick={() => complete()}
              className="mt-3 inline-flex h-9 items-center gap-2 rounded-full bg-ink px-4 text-[11px] font-semibold text-paper transition-colors hover:bg-ink/85"
            >
              Enter as Ava Chen
              <ArrowRightIcon className="size-3.5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="mt-7 space-y-4" noValidate>
            {!isLogin ? (
              <div>
                <label htmlFor="name" className="eyebrow block text-muted-ink">
                  Full name
                </label>
                <div className="relative mt-2">
                  <UserIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-ink" />
                  <input
                    id="name"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Ava Chen"
                    className="h-11 w-full rounded-xl border border-ink/15 bg-card-cream pr-4 pl-10 text-[13px] transition-colors placeholder:text-muted-ink/60 focus:border-ink/40 focus:outline-none focus-visible:ring-3 focus-visible:ring-sodium/25"
                  />
                </div>
              </div>
            ) : null}

            <div>
              <label htmlFor="email" className="eyebrow block text-muted-ink">
                Email address
              </label>
              <div className="relative mt-2">
                <MailIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-ink" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@studio.com"
                  className="h-11 w-full rounded-xl border border-ink/15 bg-card-cream pr-4 pl-10 text-[13px] transition-colors placeholder:text-muted-ink/60 focus:border-ink/40 focus:outline-none focus-visible:ring-3 focus-visible:ring-sodium/25"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="eyebrow block text-muted-ink">
                Password
              </label>
              <div className="relative mt-2">
                <LockIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-ink" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least six characters"
                  className="h-11 w-full rounded-xl border border-ink/15 bg-card-cream pr-11 pl-10 text-[13px] transition-colors placeholder:text-muted-ink/60 focus:border-ink/40 focus:outline-none focus-visible:ring-3 focus-visible:ring-sodium/25"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted-ink transition-colors hover:bg-ink/5 hover:text-ink"
                >
                  {showPassword ? (
                    <EyeOffIcon className="size-4" />
                  ) : (
                    <EyeIcon className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {!isLogin ? (
              <label className="flex items-start gap-2.5 text-[11px] leading-5 text-muted-ink">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(event) => setAgreed(event.target.checked)}
                  className="mt-1 size-3.5 shrink-0 accent-[var(--ink)]"
                />
                <span>
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-ink underline decoration-sodium decoration-2 underline-offset-2"
                  >
                    terms of service
                  </Link>{" "}
                  and understand this is a demo marketplace.
                </span>
              </label>
            ) : (
              <div className="flex items-center justify-between text-[11px]">
                <label className="flex items-center gap-2 text-muted-ink">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="size-3.5 accent-[var(--ink)]"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  className="text-ink/60 transition-colors hover:text-ink"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {error ? (
              <p
                role="alert"
                className="rounded-lg border border-clay/35 bg-clay/8 px-3 py-2 text-[11px] leading-5 text-clay"
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className={cn(
                "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-[13px] font-semibold text-paper transition-colors hover:bg-ink/88 focus-visible:ring-3 focus-visible:ring-sodium/45",
                submitting && "opacity-70",
              )}
            >
              {submitting
                ? "Opening your dashboard…"
                : isLogin
                  ? "Sign in"
                  : "Create demo account"}
              {!submitting ? <ArrowRightIcon className="size-4" /> : null}
            </button>
          </form>

          <p className="mt-6 text-center text-[12px] text-muted-ink">
            {isLogin ? "New to StudioSpace? " : "Already have an account? "}
            <Link
              href={isLogin ? "/register" : "/login"}
              className="font-semibold text-ink underline decoration-sodium decoration-2 underline-offset-4 transition-colors hover:text-clay"
            >
              {isLogin ? "Create an account" : "Sign in"}
            </Link>
          </p>

          <p className="mt-6 flex items-center justify-center gap-2 border-t border-ink/10 pt-5 text-[10px] tracking-[0.1em] text-muted-ink uppercase">
            <ShieldCheckIcon className="size-3.5 text-sage" />
            Demo only · no payment is taken
          </p>
        </div>
      </div>
    </section>
  );
}
