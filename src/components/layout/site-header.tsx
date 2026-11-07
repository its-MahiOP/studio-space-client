"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "cn";
import {
  Building2Icon,
  CalendarDaysIcon,
  ChevronDownIcon,
  HeartIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  MoonIcon,
  PlusIcon,
  SunIcon,
} from "lucide-react";

import { navLinks } from "@/data/site";
import { useAuth } from "@/components/providers/auth-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { Logo } from "@/components/layout/logo";
import { ButtonLink } from "@/components/shared/button-link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function SiteHeader() {
  const pathname = usePathname();
  const { user, ready, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled ? "true" : false}
      className={cn(
        "sticky top-0 z-50 border-b border-ink/10 bg-paper/88 backdrop-blur-xl transition-shadow duration-300",
        scrolled && "shadow-[0_12px_40px_-30px_rgba(23,21,15,0.55)]",
      )}
    >
      <div className="shell flex h-[70px] items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors",
                  active
                    ? "text-ink"
                    : "text-ink/58 hover:bg-ink/4 hover:text-ink",
                )}
              >
                {link.label}
                {active ? (
                  <span className="absolute -bottom-0.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-sodium" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
            }
            title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="grid size-10 place-items-center rounded-full border border-ink/12 text-ink transition-colors hover:bg-ink/5 focus-visible:ring-3 focus-visible:ring-sodium/45"
          >
            {theme === "dark" ? (
              <SunIcon className="size-4.5" />
            ) : (
              <MoonIcon className="size-4.5" />
            )}
          </button>
          {!ready ? (
            <span className="h-9 w-48 animate-pulse rounded-full bg-paper-deep" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                openOnHover
                className="flex items-center gap-2 rounded-full border border-ink/10 bg-paper-deep/45 py-1 pr-2.5 pl-1 transition-colors outline-none hover:border-ink/20 hover:bg-paper-deep/75 focus-visible:ring-3 focus-visible:ring-sodium/45"
                aria-label="Open account menu"
              >
                <Avatar size="sm">
                  <AvatarImage src={user.avatar} alt="" />
                  <AvatarFallback>{initials(user.name)}</AvatarFallback>
                </Avatar>
                <span className="max-w-24 truncate text-[12px] font-medium">
                  {user.name.split(" ")[0]}
                </span>
                <ChevronDownIcon className="size-3.5 text-ink/45" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-1.5">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-2 py-2">
                    <span className="flex items-center gap-2.5">
                      <Avatar size="default">
                        <AvatarImage src={user.avatar} alt="" />
                        <AvatarFallback>{initials(user.name)}</AvatarFallback>
                      </Avatar>
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-semibold text-ink">
                          {user.name}
                        </span>
                        <span className="block truncate text-[11px] font-normal text-muted-ink">
                          {user.email}
                        </span>
                      </span>
                    </span>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="px-2 py-2"
                  render={<Link href="/dashboard" />}
                >
                  <LayoutDashboardIcon />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="px-2 py-2"
                  render={<Link href="/add-studio" />}
                >
                  <PlusIcon />
                  Add New Studio
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="px-2 py-2"
                  render={<Link href="/my-listings" />}
                >
                  <Building2Icon />
                  My Studio Listings
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="px-2 py-2"
                  render={<Link href="/my-bookings" />}
                >
                  <CalendarDaysIcon />
                  My Bookings
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="px-2 py-2"
                  render={<Link href="/wishlist" />}
                >
                  <HeartIcon />
                  Saved Studios
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  className="px-2 py-2"
                  onClick={signOut}
                >
                  <LogOutIcon />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-[13px] font-medium text-ink/68 transition-colors hover:bg-ink/4 hover:text-ink"
              >
                Log in
              </Link>
              <ButtonLink href="/register" variant="primary" size="sm">
                Register
              </ButtonLink>
            </>
          )}
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            className="grid size-10 place-items-center rounded-full border border-ink/12 text-ink transition-colors hover:bg-ink/5 focus-visible:ring-3 focus-visible:ring-sodium/45 lg:hidden"
            aria-label="Open navigation"
          >
            <MenuIcon className="size-5" />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[88%] max-w-sm bg-paper p-0 text-ink"
          >
            <SheetHeader className="border-b border-ink/10 p-5">
              <SheetTitle className="sr-only">StudioSpace navigation</SheetTitle>
              <Logo />
            </SheetHeader>

            <nav aria-label="Mobile" className="flex flex-col px-5 py-4">
              {navLinks.map((link) => {
                const active = isActivePath(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between border-b border-ink/8 py-4 transition-colors",
                      active ? "text-ink" : "text-ink/62 hover:text-ink",
                    )}
                  >
                    <span className="font-display text-2xl leading-none">
                      {link.label}
                    </span>
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        active ? "bg-sodium" : "bg-transparent",
                      )}
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto space-y-4 border-t border-ink/10 p-5">
              {ready && user ? (
                <Link
                  href="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-ink/15 text-[13px] font-medium text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink"
                >
                  <HeartIcon className="size-4" />
                  Saved studios
                </Link>
              ) : null}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={
                  theme === "dark"
                    ? "Switch to light theme"
                    : "Switch to dark theme"
                }
                className="inline-flex h-11 w-full items-center justify-between rounded-full border border-ink/15 px-4 text-[13px] font-medium text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink"
              >
                <span className="inline-flex items-center gap-2">
                  {theme === "dark" ? (
                    <SunIcon className="size-4" />
                  ) : (
                    <MoonIcon className="size-4" />
                  )}
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                </span>
                <span className="eyebrow text-muted-ink">Theme</span>
              </button>
              {ready && user ? (
                <>
                  <div className="mb-5 flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt="" />
                      <AvatarFallback>{initials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-muted-ink">{user.email}</p>
                    </div>
                  </div>
                  <ButtonLink
                    href="/dashboard"
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => setMobileOpen(false)}
                  >
                    Go to dashboard
                  </ButtonLink>
                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      setMobileOpen(false);
                    }}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-ink/15 text-[13px] font-medium text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink"
                  >
                    <LogOutIcon className="size-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <ButtonLink
                    href="/login"
                    variant="outline"
                    size="md"
                    className="w-full"
                    onClick={() => setMobileOpen(false)}
                  >
                    Log in
                  </ButtonLink>
                  <ButtonLink
                    href="/register"
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => setMobileOpen(false)}
                  >
                    Register
                  </ButtonLink>
                  <p className="pt-1 text-center text-[11px] leading-5 text-muted-ink">
                    Peer-to-peer creative space, without the middle layer.
                  </p>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}