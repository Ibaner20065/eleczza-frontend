import * as React from "react";
import Link from "next/link";
import { FogBackground } from "@/components/theme/fog-background";
import { TypewriterText } from "@/components/theme/typewriter-text";
import { Shield, ArrowLeft, Key, BookOpen } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const domain = process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN || "@aot.edu.in";

  return (
    <div className="relative min-h-screen w-full bg-[#0B0C10] text-[#F4EBD9]">
      <FogBackground density="medium" />

      <div className="grid min-h-screen lg:grid-cols-12">
        {/* Left Side: Animated Sherlock Holmes 221B Showcase (Hidden on Mobile) */}
        <aside className="relative hidden flex-col justify-between border-r border-[#2D3344] bg-[#0E1017]/85 p-12 backdrop-blur-md lg:col-span-5 lg:flex xl:col-span-5">
          {/* Subtle Gaslamp Light Cone */}
          <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-radial from-[#DFB75A]/15 via-transparent to-transparent blur-2xl" />

          {/* Top Logo & Bureau Seal */}
          <div className="relative z-10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded border border-[#DFB75A] bg-[#12151C] font-serif text-lg font-bold text-[#DFB75A] shadow-[0_0_12px_rgba(223,183,90,0.3)] transition-transform group-hover:scale-105">
                §
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-wider text-[#F7F2E7]">
                  ELECZZA 2.0
                </span>
                <span className="block text-[10px] font-mono tracking-widest text-[#DFB75A] uppercase">
                  221B Scotland Yard Bureau
                </span>
              </div>
            </Link>

            <div className="wax-seal flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-[#FBF8F1] select-none">
              221B
            </div>
          </div>

          {/* Central Atmospheric Case File Display */}
          <div className="relative z-10 my-auto space-y-6 max-w-md">
            <div className="inline-flex items-center gap-2 rounded border border-[#8B1E22] bg-[#3D0B0E]/60 px-3 py-1 text-[11px] font-mono font-bold tracking-widest text-[#C93B41] uppercase">
              <Shield className="h-3.5 w-3.5" />
              RESTRICTED FORENSIC DOSSIER
            </div>

            <h2 className="font-serif text-3xl font-bold leading-snug tracking-tight text-[#F7F2E7] xl:text-4xl">
              &ldquo;The game is afoot, Inspector.&rdquo;
            </h2>

            <div className="rounded-lg border border-[#2D3344] bg-[#0B0C10]/80 p-5 shadow-inner">
              <span className="block text-[10px] font-mono text-[#DFB75A] uppercase tracking-wider mb-2">
                TELETYPE DISPATCH // 221B BAKER ST:
              </span>
              <TypewriterText
                text="It is a capital mistake to theorize before one has data. Insensibly one begins to twist facts to suit theories, instead of theories to suit facts."
                speedMs={25}
                className="text-xs text-[#D9CEB8] leading-relaxed italic"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="rounded border border-[#2D3344] bg-[#12151C] p-3">
                <div className="flex items-center gap-1.5 text-[#DFB75A] font-semibold">
                  <Key className="h-3.5 w-3.5" />
                  <span>College Domain</span>
                </div>
                <div className="mt-1 font-mono text-[11px] text-[#F7F2E7]">
                  {domain}
                </div>
              </div>

              <div className="rounded border border-[#2D3344] bg-[#12151C] p-3">
                <div className="flex items-center gap-1.5 text-[#2A7B54] font-semibold">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Case Status</span>
                </div>
                <div className="mt-1 font-mono text-[11px] text-[#F7F2E7]">
                  Active Investigation
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bureau Metadata */}
          <div className="relative z-10 border-t border-[#2D3344]/50 pt-4 text-[11px] text-[#4E5569]">
            Academy of Technology • Department of ECE
          </div>
        </aside>

        {/* Right Side: Interactive Form Container */}
        <main className="col-span-12 flex flex-col justify-between p-6 sm:p-12 lg:col-span-7 xl:col-span-7">
          {/* Top Back Nav & Mobile Header */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#D9CEB8] transition-colors hover:text-[#DFB75A]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to 221B Baker St</span>
            </Link>

            {/* Mobile-only brand banner */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="flex h-7 w-7 items-center justify-center rounded border border-[#DFB75A] bg-[#12151C] font-serif text-xs font-bold text-[#DFB75A]">
                §
              </div>
              <span className="font-serif text-sm font-bold text-[#F7F2E7]">
                ELECZZA 2.0
              </span>
            </div>
          </div>

          {/* Centered Form Area */}
          <div className="my-auto flex w-full justify-center py-8">
            <div className="w-full max-w-md">{children}</div>
          </div>

          {/* Bottom Security Assurance */}
          <div className="text-center text-[11px] text-[#4E5569]">
            Protected by Scotland Yard wire protocol. Strictly for verified{" "}
            {domain} operatives.
          </div>
        </main>
      </div>
    </div>
  );
}
