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
    <div className="relative min-h-screen w-full bg-umber text-parchment">
      <FogBackground density="medium" />

      <div className="grid min-h-screen lg:grid-cols-12">
        {/* Left Side: Animated Sherlock Holmes 221B Showcase (Hidden on Mobile) */}
        <aside className="relative hidden flex-col justify-between border-r border-fog bg-umber/85 p-12 backdrop-blur-md lg:col-span-5 lg:flex xl:col-span-5">
          {/* Subtle Gaslamp Light Cone */}
          <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-radial from-amber/15 via-transparent to-transparent blur-2xl" />

          {/* Top Logo & Bureau Seal */}
          <div className="relative z-10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded border border-amber bg-surface font-serif text-lg font-bold text-amber shadow-[0_0_12px_rgb(var(--amber-rgb)/0.3)] transition-transform group-hover:scale-105">
                §
              </div>
              <div>
                <span className="font-script text-2xl text-parchment">
                  ELECZZA 2.0
                </span>
                <span className="block text-[10px] font-mono tracking-widest text-amber uppercase">
                  221B Scotland Yard Bureau
                </span>
              </div>
            </Link>

            <div className="wax-seal flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-parchment select-none">
              221B
            </div>
          </div>

          {/* Central Atmospheric Case File Display */}
          <div className="relative z-10 my-auto space-y-6 max-w-md">
            <div className="inline-flex items-center gap-2 rounded border border-wax bg-wax/60 px-3 py-1 text-[11px] font-mono font-bold tracking-widest text-wax-foreground uppercase">
              <Shield className="h-3.5 w-3.5" />
              RESTRICTED FORENSIC DOSSIER
            </div>

            <h2 className="font-script text-3xl leading-snug text-parchment xl:text-4xl">
              &ldquo;The game is afoot, Inspector.&rdquo;
            </h2>

            <div className="rounded-lg border border-fog bg-umber/80 p-5 shadow-inner">
              <span className="block text-[10px] font-mono text-amber uppercase tracking-wider mb-2">
                TELETYPE DISPATCH // 221B BAKER ST:
              </span>
              <TypewriterText
                text="It is a capital mistake to theorize before one has data. Insensibly one begins to twist facts to suit theories, instead of theories to suit facts."
                speedMs={25}
                className="text-xs text-parchment leading-relaxed italic"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="rounded border border-fog bg-surface p-3">
                <div className="flex items-center gap-1.5 text-amber font-semibold">
                  <Key className="h-3.5 w-3.5" />
                  <span>College Domain</span>
                </div>
                <div className="mt-1 font-mono text-[11px] text-parchment">
                  {domain}
                </div>
              </div>

              <div className="rounded border border-fog bg-surface p-3">
                <div className="flex items-center gap-1.5 text-amber font-semibold">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Case Status</span>
                </div>
                <div className="mt-1 font-mono text-[11px] text-parchment">
                  Active Investigation
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bureau Metadata */}
          <div className="relative z-10 border-t border-fog/50 pt-4 text-[11px] text-muted-foreground">
            Academy of Technology • Department of ECE
          </div>
        </aside>

        {/* Right Side: Interactive Form Container */}
        <main className="col-span-12 flex flex-col justify-between p-6 sm:p-12 lg:col-span-7 xl:col-span-7">
          {/* Top Back Nav & Mobile Header */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-parchment transition-colors hover:text-amber"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to 221B Baker St</span>
            </Link>

            {/* Mobile-only brand banner */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="flex h-7 w-7 items-center justify-center rounded border border-amber bg-surface font-serif text-xs font-bold text-amber">
                §
              </div>
              <span className="font-script text-2xl text-parchment">
                ELECZZA 2.0
              </span>
            </div>
          </div>

          {/* Centered Form Area */}
          <div className="my-auto flex w-full justify-center py-8">
            <div className="w-full max-w-md">{children}</div>
          </div>

          {/* Bottom Security Assurance */}
          <div className="text-center text-[11px] text-muted-foreground">
            Protected by Scotland Yard wire protocol. Strictly for verified{" "}
            {domain} operatives.
          </div>
        </main>
      </div>
    </div>
  );
}
