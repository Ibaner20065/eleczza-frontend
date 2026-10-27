import Link from "next/link";
import Image from "next/image";
import { FogBackground } from "@/components/theme/fog-background";
import { AtmosphereEffects } from "@/components/theme/atmosphere-effects";
import { BrassButton } from "@/components/theme/brass-button";
import { Footer } from "@/components/layout/footer";
import { Shield, Search, BookOpen, Clock } from "lucide-react";

export const metadata = {
  title: "ELECZZA 2.0 — The Final Truth | Baker Street Archives",
  description:
    "A Sherlock Holmes-themed forensic investigation and cryptography quiz. Enter 221B Baker Street. Decipher the clues. Uncover The Final Truth.",
};

export default function Home() {
  const domain = process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN || "@aot.edu.in";

  return (
    <div className="relative min-h-screen flex flex-col bg-umber text-parchment">
      <FogBackground density="medium" />

      {/* ═══════════════════════════════════════════════
          HEADER / NAVIGATION
      ═══════════════════════════════════════════════ */}
      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-2.5 sm:gap-3">
          <div
            className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full font-serif text-base sm:text-lg font-bold text-parchment transition-transform group-hover:scale-105"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, #a3201a 0%, #a3201a 55%, #0d0907 100%)",
              border: "2px solid #a3201a",
              boxShadow:
                "inset 0 2px 4px rgba(233,220,192,0.2), 0 0 12px rgba(163,32,26,0.3)",
            }}
          >
            §
          </div>
          <div>
            <span className="font-archival text-base sm:text-lg font-bold tracking-[0.14em] text-parchment leading-none">
              ELECZZA 2.0
            </span>
            <span className="block font-archival text-[7px] sm:text-[8px] uppercase tracking-[0.25em] text-amber/70">
              221B Baker St Archives
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-3 sm:gap-6">
          <Link
            href="/login"
            className="font-archival text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-parchment/75 transition-colors hover:text-amber"
          >
            Authenticate
          </Link>
          <Link href="/signup">
            <BrassButton size="sm">Enlist</BrassButton>
          </Link>
        </nav>
      </header>

      {/* ═══════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════ */}
      <main className="relative z-10 flex-1">
        {/* Full-bleed hero with investigation room */}
        <section className="relative isolate min-h-[90vh] flex items-center">
          {/* Background image */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <Image
              src="/images/investigation-room.jpg"
              alt="Victorian detective's investigation room with gaslit desk, case files, and magnifying glass"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            {/* Multi-layer atmospheric overlay that reveals the Victorian study bookshelves, brass lamp, pinned evidence, and case files */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, rgba(13,9,7,0.92) 0%, rgba(13,9,7,0.72) 42%, rgba(13,9,7,0.3) 75%, rgba(13,9,7,0.65) 100%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(13,9,7,0.45) 0%, transparent 22%, transparent 68%, rgba(13,9,7,0.95) 100%)",
              }}
            />
            {/* Crimson vignette edge */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 25% 45%, rgba(163,32,26,0.09) 0%, transparent 65%)",
              }}
            />
            <AtmosphereEffects />
          </div>

          {/* Hero content */}
          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 sm:py-24">
            <div className="max-w-2xl">
              {/* Case label: The Baker Street Archives */}
              <div className="mb-4 inline-flex items-center gap-2.5 rounded-sm border border-wax/60 bg-wax/20 px-3.5 py-1.5 font-archival text-xs font-bold uppercase tracking-[0.28em] text-wax-foreground backdrop-blur-sm shadow-sm">
                <Shield className="h-3.5 w-3.5 text-amber shrink-0" />
                <span>The Baker Street Archives</span>
              </div>

              {/* Primary headline: Grand editorial display typography */}
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.92] tracking-tight text-parchment">
                THE FINAL
                <br />
                <span
                  className="font-display italic text-amber"
                  style={{
                    textShadow: "0 0 50px rgba(198,138,50,0.35)",
                  }}
                >
                  TRUTH
                </span>
              </h1>

              {/* Horizontal rule */}
              <div className="my-5 flex items-center gap-4">
                <div className="h-px flex-1 max-w-[80px] bg-wax/50" />
                <div className="font-archival text-[9px] uppercase tracking-[0.28em] text-amber/70">
                  Case File No. 005
                </div>
              </div>

              {/* Description */}
              <p className="max-w-lg font-serif text-lg leading-relaxed text-parchment/85 sm:text-xl">
                Every case hides a secret. Every witness leaves something
                unsaid. Observe carefully, connect the evidence, and discover
                whether your mind can match the world&apos;s greatest detective.
              </p>

              {/* Access restriction */}
              <p className="mt-4 font-archival text-[10px] uppercase tracking-[0.2em] text-parchment/45">
                Restricted access ·{" "}
                <span className="text-amber/80 font-semibold">{domain}</span>{" "}
                credentials required
              </p>

              {/* CTA buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/login">
                  <BrassButton size="lg" withLoupe>
                    Begin Investigation
                  </BrassButton>
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-sm border border-parchment/20 bg-surface/40 px-6 font-archival text-[11px] font-semibold uppercase tracking-[0.18em] text-parchment/70 backdrop-blur-sm transition-colors hover:border-amber/50 hover:text-parchment hover:bg-surface/70"
                >
                  Enlist as Detective
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            CASE METADATA STRIP
        ═══════════════════════════════════════════════ */}
        <section
          className="relative z-10 border-y border-fog/40"
          style={{ background: "rgba(26,17,12,0.9)" }}
        >
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
            {[
              {
                icon: <Search className="h-3.5 w-3.5" />,
                label: "Case Class",
                value: "Moriarty-Grade",
              },
              {
                icon: <BookOpen className="h-3.5 w-3.5" />,
                label: "Questions",
                value: "10 Clues",
              },
              {
                icon: <Clock className="h-3.5 w-3.5" />,
                label: "Duration",
                value: "45 Minutes",
              },
              {
                icon: <Shield className="h-3.5 w-3.5" />,
                label: "Status",
                value: "Active Investigation",
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <div className="text-amber/70">{item.icon}</div>
                <div>
                  <div className="font-archival text-[8px] uppercase tracking-[0.2em] text-parchment/50">
                    {item.label}
                  </div>
                  <div className="font-archival text-xs font-bold tracking-wider text-parchment/90">
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            THREE FEATURE PILLARS
        ═══════════════════════════════════════════════ */}
        <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 text-center">
            <div className="font-archival text-[10px] uppercase tracking-[0.3em] text-amber/60">
              The Method
            </div>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-parchment">
              Three Pillars of Deduction
            </h2>
            <div className="mx-auto mt-3 h-px w-16 bg-wax/50" />
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                seal: "I",
                title: "Cryptographic Ciphers",
                body: "Decouple multi-stage ciphers, hidden payloads, and steganographic evidence buried within the case files.",
                accent: "FORENSICS",
              },
              {
                seal: "II",
                title: "Detective Agencies",
                body: "Form your team. Designate Lead Inspectors and Cryptanalysts. Solve together in real-time synchrony.",
                accent: "COLLABORATION",
              },
              {
                seal: "III",
                title: "Scotland Yard Ledger",
                body: "Live competitive telemetry tracks deduction speed, accuracy, and penalty points across all agencies.",
                accent: "COMPETITION",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group relative rounded-sm border border-fog/60 p-7 transition-colors hover:border-amber/40"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(26,17,12,0.95) 0%, rgba(13,9,7,0.85) 100%)",
                  boxShadow: "inset 0 1px 0 rgba(233,220,192,0.03)",
                }}
              >
                {/* Roman numeral seal */}
                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-full font-archival text-sm font-bold text-parchment"
                  style={{
                    background:
                      "radial-gradient(circle at 35% 35%, #a3201a 0%, #a3201a 55%, #0d0907 100%)",
                    border: "1.5px solid rgba(163,32,26,0.8)",
                  }}
                >
                  {item.seal}
                </div>

                <div className="mb-2 font-archival text-[8px] uppercase tracking-[0.25em] text-amber/60">
                  {item.accent}
                </div>
                <h3 className="font-display text-xl font-bold text-parchment">
                  {item.title}
                </h3>
                <p className="mt-2 font-serif text-base leading-relaxed text-parchment/70">
                  {item.body}
                </p>

                {/* Subtle hover indicator */}
                <div className="mt-4 h-px w-0 bg-amber/40 transition-all duration-500 group-hover:w-full" />
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            FINAL CTA BAND
        ═══════════════════════════════════════════════ */}
        <section
          className="relative z-10 py-20"
          style={{
            background:
              "linear-gradient(to bottom, rgba(13,9,7,0) 0%, rgba(163,32,26,0.04) 50%, rgba(13,9,7,0) 100%)",
          }}
        >
          <div className="mx-auto max-w-2xl px-6 text-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-wax-foreground/60">
              The game is afoot
            </div>
            <h2 className="mt-3 font-serif text-4xl font-bold text-parchment sm:text-5xl">
              Are you ready to <span className="text-amber">investigate?</span>
            </h2>
            <p className="mt-4 font-serif text-base leading-relaxed text-parchment/60">
              221B Baker Street awaits. Your credentials will be verified, your
              agency assembled, and the case file unsealed.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/login">
                <BrassButton size="lg" withLoupe>
                  Enter 221B Baker St
                </BrassButton>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
