import { cn } from "cn";

export function XLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-4", className)}
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function InstagramLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-4", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedInLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-4", className)}
      fill="currentColor"
    >
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6.5 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.7c0-1.36-.03-3.1-1.9-3.1-1.9 0-2.19 1.47-2.19 2.99V21h-4V9Z" />
    </svg>
  );
}

export function YouTubeLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-4", className)}
      fill="currentColor"
    >
      <path d="M21.6 7.2a2.6 2.6 0 0 0-1.83-1.84C18.14 4.9 12 4.9 12 4.9s-6.14 0-7.77.46A2.6 2.6 0 0 0 2.4 7.2 27.2 27.2 0 0 0 1.94 12a27.2 27.2 0 0 0 .46 4.8 2.6 2.6 0 0 0 1.83 1.84c1.63.46 7.77.46 7.77.46s6.14 0 7.77-.46a2.6 2.6 0 0 0 1.83-1.84A27.2 27.2 0 0 0 22.06 12a27.2 27.2 0 0 0-.46-4.8ZM10.05 15.1V8.9L15.4 12l-5.35 3.1Z" />
    </svg>
  );
}
