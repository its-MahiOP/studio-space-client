"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { cn } from "cn";
import {
  ArrowLeftIcon,
  Building2Icon,
  CalendarDaysIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  PlusIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboardIcon },
  {
    href: "/dashboard/add-studio",
    label: "Add New Studio",
    icon: PlusIcon,
  },
  {
    href: "/dashboard/listings",
    label: "My Studio Listings",
    icon: Building2Icon,
  },
  {
    href: "/dashboard/bookings",
    label: "My Bookings",
    icon: CalendarDaysIcon,
  },
] as const;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready, signOut } = useAuth();

  useEffect(() => {
    if (ready && !user) {
      router.replace("/login");
    }
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <div className="shell flex min-h-[60vh] items-center justify-center py-20">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto size-10 animate-pulse rounded-full bg-paper-deep" />
          <p className="mt-5 text-[13px] text-muted-ink">
            {ready ? "Taking you to sign in…" : "Opening your dashboard…"}
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

  return (
    <div className="border-t border-ink/10 bg-paper-deep/25">
      <div className="shell py-8 lg:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[248px_1fr] lg:gap-10">
          <aside className="min-w-0 lg:sticky lg:top-[94px] lg:self-start">
            <div className="min-w-0 rounded-[20px] border border-ink/12 bg-card-cream p-4">
              <div className="flex items-center gap-3 border-b border-ink/10 pb-4">
                <Avatar size="lg">
                  <AvatarImage src={user.avatar} alt="" />
                  <AvatarFallback>{initials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold">{user.name}</p>
                  <p className="truncate text-[11px] text-muted-ink">{user.role}</p>
                </div>
              </div>

              <nav
                aria-label="Dashboard"
                className="no-scrollbar mt-3 grid grid-cols-2 gap-1 lg:flex lg:flex-col"
              >
                {links.map((link) => {
                  const active = isActive(pathname, link.href);
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-[12px] font-medium transition-colors",
                        active
                          ? "bg-ink text-paper"
                          : "text-ink/62 hover:bg-ink/5 hover:text-ink",
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-4 border-t border-ink/10 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    router.push("/");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[12px] font-medium text-ink/55 transition-colors hover:bg-clay/8 hover:text-clay"
                >
                  <LogOutIcon className="size-4" />
                  Logout
                </button>
              </div>
            </div>

            <div className="mt-4 hidden rounded-[20px] border border-ink/12 bg-card-cream p-4 lg:block">
              <ShieldCheckIcon className="size-4 text-sage" />
              <p className="mt-3 text-[11px] leading-5 text-muted-ink">
                Every listing is covered by $1M liability protection and 24/7
                host support.
              </p>
              <Link
                href="/how-it-works"
                className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink transition-colors hover:text-clay"
              >
                Host guide
                <ArrowLeftIcon className="size-3 rotate-180" />
              </Link>
            </div>

            <Link
              href="/"
              className="mt-4 hidden items-center gap-2 px-1 text-[11px] text-muted-ink transition-colors hover:text-ink lg:flex"
            >
              <ArrowLeftIcon className="size-3" />
              Back to the marketplace
            </Link>
          </aside>

          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
