import React from "react";
import Link from "next/link";
import { FogBackdrop } from "@/components/theme/fog-backdrop";
import { Shield, Users, HelpCircle, Trophy } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen text-[#F7F2E7]">
      <FogBackdrop />

      {/* Detective Bureau Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-[#2D3344] bg-[#0B0C10]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded border border-[#DFB75A]/60 bg-[#12151C] font-bold text-[#DFB75A]">
              E
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-wider text-[#F7F2E7]">
                ELECZZA
              </span>
              <span className="ml-2 hidden text-[10px] tracking-widest text-[#DFB75A] uppercase sm:inline-block">
                221B Bureau
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium text-[#D9CEB8] transition-colors hover:bg-[#1C202B] hover:text-[#DFB75A]"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Study</span>
            </Link>
            <Link
              href="/team"
              className="flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium text-[#D9CEB8] transition-colors hover:bg-[#1C202B] hover:text-[#DFB75A]"
            >
              <Users className="h-3.5 w-3.5" />
              <span>Agency</span>
            </Link>
            <Link
              href="/quiz"
              className="flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium text-[#D9CEB8] transition-colors hover:bg-[#1C202B] hover:text-[#DFB75A]"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Cases</span>
            </Link>
            <Link
              href="/leaderboard"
              className="flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium text-[#D9CEB8] transition-colors hover:bg-[#1C202B] hover:text-[#DFB75A]"
            >
              <Trophy className="h-3.5 w-3.5" />
              <span>Ledger</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
