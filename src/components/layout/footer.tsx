import * as React from "react";
import Link from "next/link";
import { ShieldCheck, Radio } from "lucide-react";

export function Footer() {
  const domain = process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN || "@aot.edu.in";

  return (
    <footer className="w-full border-t border-[#2D3344] bg-[#0B0C10] text-[#D9CEB8] text-xs">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-12">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded border border-[#DFB75A] bg-[#12151C] font-serif text-sm font-bold text-[#DFB75A]">
                §
              </div>
              <span className="font-serif text-base font-bold tracking-wider text-[#F7F2E7]">
                ELECZZA 2.0
              </span>
            </div>
            <p className="max-w-sm text-xs text-[#8892B0] leading-relaxed">
              The official forensic and cryptographic deduction tournament of
              the Academy of Technology. Sift evidence, solve multi-stage
              ciphers, and climb the Scotland Yard Ledger.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#2A7B54]">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              <span>Scotland Yard Wire Protocol: Operational</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="space-y-2 md:col-span-3">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#DFB75A]">
              Bureau Coordinates
            </div>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-[#DFB75A] transition-colors"
                >
                  Inspector Study
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="hover:text-[#DFB75A] transition-colors"
                >
                  Agency Roster
                </Link>
              </li>
              <li>
                <Link
                  href="/quiz"
                  className="hover:text-[#DFB75A] transition-colors"
                >
                  Active Investigation Files
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className="hover:text-[#DFB75A] transition-colors"
                >
                  Scotland Yard Ledger
                </Link>
              </li>
              <li>
              </li>
            </ul>
          </div>

          {/* Security & Domain Policy */}
          <div className="space-y-2 md:col-span-4">
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#DFB75A]">
              Domain Enforcement
            </div>
            <p className="text-xs text-[#8892B0] leading-relaxed">
              Contest eligibility is strictly restricted to verified emails
              ending with <strong className="text-[#F4EBD9]">{domain}</strong>.
              External requests are rejected at the Scotland Yard gateway.
            </p>
            <div className="inline-flex items-center gap-1.5 rounded border border-[#2D3344] bg-[#12151C] px-3 py-1.5 text-[11px] text-[#DFB75A]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Zero external domain tolerance active</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between border-t border-[#2D3344]/50 pt-6 text-[11px] text-[#4E5569] sm:flex-row">
          <div>© 2026 ELECZZA 2.0. All forensic deductions reserved.</div>
          <div className="mt-2 font-mono sm:mt-0">
            221B Baker St. Archival System • Ver 3.0
          </div>
        </div>
      </div>
    </footer>
  );
}
