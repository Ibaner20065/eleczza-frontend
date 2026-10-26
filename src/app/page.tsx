import Link from "next/link";
import { FogBackground } from "@/components/theme/fog-background";
import { BrassButton } from "@/components/theme/brass-button";
import { Footer } from "@/components/layout/footer";
import { ArrowRight, Compass, Shield, Award } from "lucide-react";

export default function Home() {
  const domain = process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN || "@aot.edu.in";

  return (
    <div className="relative min-h-screen flex flex-col justify-between text-parchment">
      <FogBackground density="medium" />

      {/* Header */}
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded border border-amber/60 bg-surface text-lg font-bold text-amber">
            §
          </div>
          <span className="font-script text-2xl text-parchment">
            ELECZZA 2.0
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs font-semibold text-parchment transition-colors hover:text-amber"
          >
            Authenticate
          </Link>
          <Link href="/signup">
            <BrassButton size="sm">Enlist Agency</BrassButton>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-5xl px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber/40 bg-surface px-3.5 py-1 text-xs font-semibold tracking-wider text-amber uppercase">
          <Shield className="h-3.5 w-3.5" />
          The Game is Afoot • Academy of Technology
        </div>

        <h1 className="font-script mt-6 text-4xl leading-tight text-parchment sm:text-6xl">
          Forensics, Ciphers & <br />
          <span className="text-amber">Deductive Investigation</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-parchment">
          Step into 221B Baker Street. Form your detective agency, interrogate
          cryptographic clues, examine crime scene evidence, and race against
          the clock on the Scotland Yard Ledger.
        </p>

        <div className="mt-3 text-xs text-parchment">
          Restricted access: Valid{" "}
          <strong className="text-amber">{domain}</strong> credentials strictly
          required.
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/login">
            <BrassButton size="lg" withLoupe>
              Enter 221B Baker St
            </BrassButton>
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-fog bg-surface px-6 text-xs font-semibold uppercase tracking-wider text-parchment transition-colors hover:border-amber/50"
          >
            Inspector Study Demo
            <ArrowRight className="h-3.5 w-3.5 text-amber" />
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="mt-20 grid gap-6 sm:grid-cols-3 text-left">
          <div className="parchment-border rounded-lg bg-surface p-6">
            <Compass className="h-6 w-6 text-amber" />
            <h3 className="mt-3 font-bold text-parchment">
              Cryptographic Ciphers
            </h3>
            <p className="mt-2 text-xs text-parchment leading-relaxed">
              Decouple complex multi-stage ciphers, hidden payloads, and
              steganographic evidence.
            </p>
          </div>

          <div className="parchment-border rounded-lg bg-surface p-6">
            <Shield className="h-6 w-6 text-amber" />
            <h3 className="mt-3 font-bold text-parchment">
              Detective Agencies
            </h3>
            <p className="mt-2 text-xs text-parchment leading-relaxed">
              Team up with fellow students. Designate Lead Inspectors and
              Cryptanalysts to solve in sync.
            </p>
          </div>

          <div className="parchment-border rounded-lg bg-surface p-6">
            <Award className="h-6 w-6 text-amber" />
            <h3 className="mt-3 font-bold text-parchment">
              Scotland Yard Ledger
            </h3>
            <p className="mt-2 text-xs text-parchment leading-relaxed">
              Real-time competitive telemetry tracking deduction speed,
              accuracy, and penalty points.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
