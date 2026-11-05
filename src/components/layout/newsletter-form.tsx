"use client";

import { useState } from "react";
import { ArrowRightIcon, CheckIcon } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="max-w-md"
      onSubmit={(event) => {
        event.preventDefault();
        if (!email.trim()) return;
        setSubmitted(true);
        setEmail("");
      }}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex items-center gap-1 rounded-full border border-paper/22 bg-paper/6 p-1 transition-colors focus-within:border-sodium/70">
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setSubmitted(false);
          }}
          placeholder="you@studio.com"
          className="h-10 min-w-0 flex-1 bg-transparent px-4 text-[13px] text-paper placeholder:text-paper/35 focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-sodium px-4 text-[12px] font-semibold text-ink transition-colors hover:bg-sodium/85 focus-visible:ring-3 focus-visible:ring-sodium/40"
        >
          {submitted ? (
            <>
              Joined <CheckIcon className="size-3.5" />
            </>
          ) : (
            <>
              Join <ArrowRightIcon className="size-3.5" />
            </>
          )}
        </button>
      </div>
      <p
        role="status"
        className="mt-3 text-[11px] leading-5 text-paper/42"
      >
        {submitted
          ? "You're on the list. The next field note is headed your way."
          : "Occasional studio drops and host notes. No noise, ever."}
      </p>
    </form>
  );
}
