import Link from "next/link";
import { FogBackdrop } from "@/components/theme/fog-backdrop";
import { ArrowRight, Compass, Shield, Award } from "lucide-react";

export default function Home() {
  const domain = process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN || "@aot.edu.in";

  return (
    <div className="relative min-h-screen text-[#F7F2E7]">
      <FogBackdrop />

      {/* Header */}
      <header className="mx-auto flex max-w-7xl items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded border border-[#DFB75A]/60 bg-[#12151C] text-lg font-bold text-[#DFB75A]">
            E
          </div>
          <span className="font-serif text-xl font-bold tracking-wider text-[#F7F2E7]">
            ELECZZA
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs font-semibold text-[#D9CEB8] transition-colors hover:text-[#DFB75A]"
          >
            Authenticate
          </Link>
          <Link
            href="/signup"
            className="rounded border border-[#DFB75A] bg-[#DFB75A] px-4 py-1.5 text-xs font-semibold text-[#0B0C10] transition-colors hover:bg-[#C59B27]"
          >
            Enlist Agency
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-5xl px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#DFB75A]/40 bg-[#12151C] px-3.5 py-1 text-xs font-semibold tracking-wider text-[#DFB75A] uppercase">
          <Shield className="h-3.5 w-3.5" />
          The Game is Afoot • Academy of Technology
        </div>

        <h1 className="mt-6 font-serif text-4xl font-extrabold tracking-tight text-[#F7F2E7] sm:text-6xl">
          Forensics, Ciphers & <br />
          <span className="text-[#DFB75A]">Deductive Investigation</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#D9CEB8]">
          Step into 221B Baker Street. Form your detective agency, interrogate
          cryptographic clues, examine crime scene evidence, and race against
          the clock on the Scotland Yard Ledger.
        </p>

        <div className="mt-3 text-xs text-[#D9CEB8]">
          Restricted access: Valid{" "}
          <strong className="text-[#DFB75A]">{domain}</strong> credentials
          strictly required.
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#DFB75A] px-6 text-sm font-semibold text-[#0B0C10] shadow-lg transition-colors hover:bg-[#C59B27]"
          >
            Enter 221B Baker St
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#2D3344] bg-[#12151C] px-6 text-sm font-semibold text-[#F7F2E7] transition-colors hover:border-[#DFB75A]/50"
          >
            Inspector Study Demo
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="mt-20 grid gap-6 text-left sm:grid-cols-3">
          <div className="parchment-border rounded-lg bg-[#12151C] p-6">
            <Compass className="h-6 w-6 text-[#DFB75A]" />
            <h3 className="mt-3 font-bold text-[#F7F2E7]">
              Cryptographic Ciphers
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#D9CEB8]">
              Decouple complex multi-stage ciphers, hidden payloads, and
              steganographic evidence.
            </p>
          </div>

          <div className="parchment-border rounded-lg bg-[#12151C] p-6">
            <Shield className="h-6 w-6 text-[#DFB75A]" />
            <h3 className="mt-3 font-bold text-[#F7F2E7]">
              Detective Agencies
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#D9CEB8]">
              Team up with fellow students. Designate Lead Inspectors and
              Cryptanalysts to solve in sync.
            </p>
          </div>

          <div className="parchment-border rounded-lg bg-[#12151C] p-6">
            <Award className="h-6 w-6 text-[#DFB75A]" />
            <h3 className="mt-3 font-bold text-[#F7F2E7]">
              Scotland Yard Ledger
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#D9CEB8]">
              Real-time competitive telemetry tracking deduction speed,
              accuracy, and penalty points.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
