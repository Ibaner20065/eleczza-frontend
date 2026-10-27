import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { FogBackground } from "@/components/theme/fog-background";
import { AtmosphereEffects } from "@/components/theme/atmosphere-effects";
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
        <aside className="relative isolate hidden flex-col justify-between overflow-hidden border-r border-[#3a2e24] bg-umber p-12 lg:col-span-5 lg:flex xl:col-span-5">
          <div className="pointer-events-none absolute inset-0 z-0">
            <Image
              src="/images/hero-sherlock.jpg"
              alt="Sherlock Holmes studying case evidence by candle and street light"
              fill
              priority
              sizes="(min-width: 1280px) 42vw, (min-width: 1024px) 42vw, 0px"
              className="object-cover object-[52%_center]"
            />
            {/* Filmic atmospheric overlay that preserves the detective, candle lighting, desk, and London street lamp */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(13,9,7,0.55) 0%, rgba(13,9,7,0.2) 28%, rgba(13,9,7,0.35) 60%, rgba(13,9,7,0.88) 100%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 35%, transparent 35%, rgba(13,9,7,0.65) 100%)",
              }}
            />
            <AtmosphereEffects />
          </div>

          {/* Subtle Gaslamp Light Cone */}
          <div className="pointer-events-none absolute -top-24 left-1/2 z-[1] h-96 w-96 -translate-x-1/2 rounded-full bg-radial from-amber/15 via-transparent to-transparent blur-2xl" />

          {/* Top Logo & Bureau Seal */}
          <div className="relative z-[2] flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="wax-seal flex h-10 w-10 items-center justify-center rounded-full font-serif text-lg font-bold text-parchment shadow-[0_0_12px_rgb(var(--wax-rgb)/0.3)] transition-transform group-hover:scale-105">
                §
              </div>
              <div>
                <span className="font-archival text-lg font-bold tracking-[0.2em] text-parchment">
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
          <div className="relative z-[2] my-auto max-w-md space-y-6">
            <div className="inline-flex items-center gap-2 rounded border border-wax bg-wax/75 px-3 py-1 text-[11px] font-mono font-bold tracking-widest text-wax-foreground uppercase shadow-md">
              <Shield className="h-3.5 w-3.5 text-amber" />
              RESTRICTED FORENSIC DOSSIER
            </div>

            <h2 className="font-script text-3xl leading-snug text-parchment xl:text-4xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              &ldquo;The game is afoot, Inspector.&rdquo;
            </h2>

            {/* Confidential Telegram Dispatch Panel */}
            <div
              className="rounded-sm border border-[#4a3a2a] p-5 shadow-[inset_0_1px_0_rgba(233,220,192,0.08),0_4px_16px_rgba(13,9,7,0.7)] backdrop-blur-sm"
              style={{
                background:
                  "linear-gradient(145deg, rgba(26,17,12,0.88) 0%, rgba(18,12,8,0.92) 100%)",
              }}
            >
              <div className="flex items-center justify-between border-b border-[#3a2e24] pb-2 mb-2.5">
                <span className="font-mono text-[9px] font-bold text-amber uppercase tracking-[0.22em]">
                  POST OFFICE TELEGRAPHS // CONFIDENTIAL
                </span>
                <span className="font-mono text-[9px] text-parchment/40">
                  DISPATCH 221B
                </span>
              </div>
              <TypewriterText
                text="It is a capital mistake to theorize before one has data. Insensibly one begins to twist facts to suit theories, instead of theories to suit facts."
                speedMs={25}
                className="font-mono text-xs text-parchment/90 leading-relaxed italic"
              />
            </div>

            {/* Compact Information Panels */}
            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div className="rounded-sm border border-[#3a2e24] bg-surface/85 p-3 backdrop-blur-sm shadow-sm">
                <div className="flex items-center gap-1.5 text-amber font-semibold">
                  <Key className="h-3.5 w-3.5" />
                  <span className="font-archival text-[10px] uppercase tracking-wider">
                    College Domain
                  </span>
                </div>
                <div className="mt-1 font-mono text-[11px] text-parchment font-medium">
                  {domain}
                </div>
              </div>

              <div className="rounded-sm border border-[#3a2e24] bg-surface/85 p-3 backdrop-blur-sm shadow-sm">
                <div className="flex items-center gap-1.5 text-amber font-semibold">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span className="font-archival text-[10px] uppercase tracking-wider">
                    Case Status
                  </span>
                </div>
                <div className="mt-1 font-mono text-[11px] text-parchment font-medium">
                  Active Investigation
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bureau Metadata */}
          <div className="relative z-[2] border-t border-[#3a2e24] pt-4 font-archival text-[10px] uppercase tracking-wider text-parchment/50">
            Academy of Technology • Department of ECE
          </div>
        </aside>

        {/* Right Side: Interactive Form Container */}
        <main className="col-span-12 flex flex-col justify-between p-6 sm:p-12 lg:col-span-7 xl:col-span-7">
          {/* Top Back Nav & Mobile Header */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-archival text-xs font-semibold tracking-wider text-parchment/80 transition-colors hover:text-amber"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to 221B Baker Street</span>
            </Link>

            {/* Mobile-only brand banner */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="wax-seal flex h-7 w-7 items-center justify-center rounded-full font-serif text-xs font-bold text-parchment">
                §
              </div>
              <span className="font-archival text-base font-bold tracking-[0.2em] text-parchment">
                ELECZZA 2.0
              </span>
            </div>
          </div>

          {/* Centered Form Area */}
          <div className="my-auto flex w-full justify-center py-8">
            <div className="w-full max-w-md">{children}</div>
          </div>

          {/* Bottom Security Assurance */}
          <div className="text-center font-serif text-xs text-parchment/50">
            Protected by Scotland Yard wire protocol. Strictly for verified{" "}
            <span className="font-mono text-amber/80 font-semibold">
              {domain}
            </span>{" "}
            operatives.
          </div>
        </main>
      </div>
    </div>
  );
}
