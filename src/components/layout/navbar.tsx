"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BrassButton } from "@/components/theme/brass-button";
import {
  Shield,
  Users,
  HelpCircle,
  Trophy,
  Menu,
  X,
  Palette,
  LogOut,
  User,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { label: "Study", href: "/dashboard", icon: Shield },
  { label: "Agency", href: "/team", icon: Users },
  { label: "Case Files", href: "/quiz", icon: HelpCircle },
  { label: "Ledger", href: "/leaderboard", icon: Trophy },
  { label: "Styleguide", href: "/styleguide", icon: Palette },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const domain = process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN || "@aot.edu.in";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#2D3344] bg-[#0B0C10]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded border border-[#DFB75A] bg-[#12151C] font-serif text-base font-bold text-[#DFB75A] shadow-[0_0_10px_rgba(223,183,90,0.25)] transition-transform group-hover:scale-105">
            §
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold tracking-wider text-[#F7F2E7] group-hover:text-[#DFB75A] transition-colors">
              ELECZZA
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#DFB75A] uppercase">
              221B Bureau
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all",
                  isActive
                    ? "bg-[#DFB75A]/15 text-[#DFB75A] border border-[#DFB75A]/40 shadow-[0_0_10px_rgba(223,183,90,0.15)]"
                    : "text-[#D9CEB8] hover:bg-[#1C202B] hover:text-[#F4EBD9]",
                )}
              >
                <Icon
                  className={cn(
                    "h-3.5 w-3.5",
                    isActive ? "text-[#DFB75A]" : "text-[#8892B0]",
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Badges & Profile */}
        <div className="hidden items-center gap-3 md:flex">
          <div className="rounded border border-[#2D3344] bg-[#12151C] px-2.5 py-1 font-mono text-[11px] text-[#DFB75A]">
            {domain}
          </div>

          <Link href="/login">
            <BrassButton size="sm">
              <User className="h-3.5 w-3.5 mr-1" />
              Inspector
            </BrassButton>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded border border-[#2D3344] bg-[#12151C] p-2 text-[#D9CEB8] hover:text-[#DFB75A] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-[#2D3344] bg-[#0E1017] p-4 md:hidden space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors",
                  isActive
                    ? "bg-[#DFB75A]/15 text-[#DFB75A] border border-[#DFB75A]/40"
                    : "text-[#D9CEB8] hover:bg-[#1C202B] hover:text-[#F4EBD9]",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-[#2D3344] flex items-center justify-between">
            <span className="font-mono text-[11px] text-[#DFB75A]">
              {domain}
            </span>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-1 text-xs text-[#DFB75A] font-semibold"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
