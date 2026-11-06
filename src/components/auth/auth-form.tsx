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
  ImageIcon,
  LockIcon,
  MailIcon,
  ShieldCheckIcon,
  UserIcon,
  XIcon,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

type Mode = "login" | "register";

/** Password rules required by the assignment (enforced before sign-up). */
const PASSWORD_RULES = [
  { label: "An uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { label: "A lowercase letter", test: (value: string) => /[a-z]/.test(value) },
  { label: "At least 6 characters", test: (value: string) => value.length >= 6 },
];

const GENERIC_HTTP_ERRORS = new Set([
  "Bad Request",
  "Unauthorized",
  "Forbidden",
  "Not Found",
  "Internal Server Error",
  "Too Many Requests",
]);

/** Pull a human readable message out of a BetterFetchError. */
function readErrorMessage(
  error: { message?: string; error?: unknown } | null | undefined,
  fallback: string,
) {
  if (!error) return fallback;

  const body = error.error as { message?: unknown } | undefined;
  if (body && typeof body.message === "string" && body.message.trim()) {
    return body.message;
  }
  if (
    typeof error.message === "string" &&
    error.message.trim() &&
    !GENERIC_HTTP_ERRORS.has(error.message)
  ) {
    return error.message;
  }
  return fallback;
}

/** The route to return to after signing in (set by RequireAuth), else home. */
function getRedirectTarget() {
  const redirect = new URLSearchParams(window.location.search).get("redirect");
  if (!redirect || !redirect.startsWith("/") || redirect.startsWith("//")) {
    return "/";
  }
  return redirect;
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const isLogin = mode === "login";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function fail(title: string, message: string) {
    setError(message);
    toast.add({ type: "error", title, description: message });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPasswordError(null);

    const trimmedEmail = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      fail(
        "Check your email",
        "That email doesn't look right. Try name@studio.com.",
      );
      return;
    }

    if (isLogin) {
      if (!password) {
        fail("Password required", "Enter your password to continue.");
        return;
      }
    } else {
      if (name.trim().length < 2) {
        fail(
          "Check your name",
          "Tell us what to call you — at least two characters.",
        );
        return;
      }
      if (!isValidHttpUrl(photoUrl.trim())) {
        fail(
          "Check your photo URL",
          "Enter a full photo URL starting with http:// or https://.",
        );
        return;
      }
      const failedRules = PASSWORD_RULES.filter(
        (rule) => !rule.test(password),
      );
      if (failedRules.length > 0) {
        const message = `Password must include ${failedRules
          .map((rule) => rule.label.toLowerCase())
          .join(", ")}.`;
        setPasswordError(message);
        toast.add({
          type: "error",
          title: "Password doesn't meet the rules",
          description: message,
        });
        return;
      }
    }

    setSubmitting(true);
    try {
      if (isLogin) {
        const { error: signInError } = await authClient.signIn.email({
          email: trimmedEmail,
          password,
        });
        if (signInError) {
          fail(
            "Could not sign in",
            readErrorMessage(signInError, "Invalid email or password."),
          );
          return;
        }
        toast.add({
          type: "success",
          title: "Welcome back",
          description: "You're signed in — picking up where you left off.",
        });
        // Land on the route the user originally wanted, else the home page.
        router.push(getRedirectTarget());
        router.refresh();
      } else {
        const { error: signUpError } = await authClient.signUp.email({
          name: name.trim(),
          email: trimmedEmail,
          password,
          image: photoUrl.trim(),
        });
        if (signUpError) {
          fail(
            "Could not create the account",
            readErrorMessage(
              signUpError,
              "Something went wrong. Please try again.",
            ),
          );
          return;
        }
        // BetterAuth signs the user in on sign-up; sign them out again so the
        // next step is signing in with the new credentials.
        await authClient.signOut();
        toast.add({
          type: "success",
          title: "Account created",
          description: "Sign in with your new credentials to continue.",
        });
        router.push("/login");
      }
    } catch {
      fail(
        "Network error",
        "We couldn't reach the server. Check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function onGoogleContinue() {
    setError(null);
    setPasswordError(null);
    setSubmitting(true);
    try {
      const { error: socialError } = await authClient.signIn.social({
        provider: "google",
        // Login returns to the desired route; registration lands on home.
        callbackURL: isLogin ? getRedirectTarget() : "/",
      });
      if (socialError) {
        fail(
          "Could not continue with Google",
          readErrorMessage(socialError, "Google sign-in failed. Try again."),
        );
        setSubmitting(false);
      }
      // On success the client redirects to Google straight away.
    } catch {
      fail(
        "Network error",
        "We couldn't reach the server. Try again in a moment.",
      );
      setSubmitting(false);
    }
  }

  function onForgotPassword() {
    toast.add({
      type: "info",
      title: "Forgot password?",
      description:
        "Password reset isn't enabled in this build — get in touch and we'll help you back in.",
    });
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
                Create your
                <br />
                <span className="italic text-clay">account.</span>
              </>
            )}
          </h1>
          <p className="mt-4 text-[13px] leading-6 text-muted-ink">
            {isLogin
              ? "Sign in to book rooms, manage listings and track your shoots."
              : "Create an account to book rooms and list your own space. No card, no email confirmation."}
          </p>

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

            {!isLogin ? (
              <div>
                <label
                  htmlFor="photoUrl"
                  className="eyebrow block text-muted-ink"
                >
                  Photo URL
                </label>
                <div className="relative mt-2">
                  <ImageIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-ink" />
                  <input
                    id="photoUrl"
                    name="photoUrl"
                    type="url"
                    autoComplete="url"
                    value={photoUrl}
                    onChange={(event) => setPhotoUrl(event.target.value)}
                    placeholder="https://your-site.com/photo.jpg"
                    className="h-11 w-full rounded-xl border border-ink/15 bg-card-cream pr-4 pl-10 text-[13px] transition-colors placeholder:text-muted-ink/60 focus:border-ink/40 focus:outline-none focus-visible:ring-3 focus-visible:ring-sodium/25"
                  />
                </div>
              </div>
            ) : null}

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
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (
                      passwordError &&
                      PASSWORD_RULES.every((rule) =>
                        rule.test(event.target.value),
                      )
                    ) {
                      setPasswordError(null);
                    }
                  }}
                  placeholder={
                    isLogin ? "Enter your password" : "Create a strong password"
                  }
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

              {!isLogin ? (
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  {PASSWORD_RULES.map((rule) => {
                    const passed = rule.test(password);
                    return (
                      <li
                        key={rule.label}
                        className={cn(
                          "flex items-center gap-1.5 text-[11px]",
                          passed ? "text-sage-ink" : "text-muted-ink",
                        )}
                      >
                        {passed ? (
                          <CheckIcon className="size-3" />
                        ) : (
                          <XIcon className="size-3" />
                        )}
                        {rule.label}
                      </li>
                    );
                  })}
                </ul>
              ) : null}

              {passwordError ? (
                <p
                  role="alert"
                  className="mt-2 text-[11px] leading-5 text-clay"
                >
                  {passwordError}
                </p>
              ) : null}
            </div>

            {isLogin ? (
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-[11px] text-ink/60 transition-colors hover:text-ink"
                >
                  Forgot password?
                </button>
              </div>
            ) : null}

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
                ? isLogin
                  ? "Signing in…"
                  : "Creating your account…"
                : isLogin
                  ? "Sign in"
                  : "Create account"}
              {!submitting ? <ArrowRightIcon className="size-4" /> : null}
            </button>
          </form>

          <div className="mt-5 flex items-center gap-3 text-[10px] tracking-[0.1em] text-muted-ink uppercase">
            <span className="h-px flex-1 bg-ink/10" />
            <span>or</span>
            <span className="h-px flex-1 bg-ink/10" />
          </div>

          <button
            type="button"
            onClick={onGoogleContinue}
            disabled={submitting}
            className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full border border-ink/15 bg-card-cream text-[13px] font-semibold text-ink transition-colors hover:bg-ink/4 focus-visible:ring-3 focus-visible:ring-sodium/45 disabled:opacity-60"
          >
            <GoogleIcon className="size-4" />
            {isLogin ? "Continue with Google" : "Sign up with Google"}
          </button>

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
            Encrypted sign-in · your details stay private
          </p>
        </div>
      </div>
    </section>
  );
}
