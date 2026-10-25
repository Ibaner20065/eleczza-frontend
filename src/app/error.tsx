"use client";

import * as React from "react";
import Link from "next/link";
import { FogBackground } from "@/components/theme/fog-background";
import { BrassButton } from "@/components/theme/brass-button";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Shield, Home } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log forensic error details
    console.error("Forensic Deduction Mishap:", error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-6 text-center text-[#F4EBD9]">
      <FogBackground density="heavy" />

      <div className="parchment-border relative w-full max-w-xl rounded-lg bg-[#12151C]/95 p-8 shadow-2xl backdrop-blur-md">
        {/* Red Ink Error Stamp */}
        <div className="absolute -top-3 -right-3 select-none pointer-events-none">
          <div className="ink-stamp border-[#8B1E22] bg-[#3D0B0E]/90 px-3 py-1 text-xs tracking-widest text-[#C93B41]">
            ANOMALY DETECTED
          </div>
        </div>

        {/* Central Error Insignia */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#8B1E22] bg-[#3D0B0E]/70 text-[#C93B41] shadow-[0_0_20px_rgba(139,30,34,0.35)]">
          <AlertTriangle className="h-8 w-8 text-[#C93B41] animate-bounce" />
        </div>

        {/* Title & Anomaly Ref */}
        <div className="mt-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-[#C93B41]">
            <Shield className="h-3.5 w-3.5" />
            <span>Forensic Synthesis Failure</span>
          </div>

          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#F7F2E7] sm:text-4xl">
            Deductive Chain Fractured
          </h1>

          <p className="mx-auto max-w-md text-xs text-[#D9CEB8] leading-relaxed">
            An unforeseen anomaly has compromised the case records. The
            hypothesis cannot proceed without re-evaluating the physical
            evidence.
          </p>
        </div>

        {/* Technical Forensic Breakdown */}
        <div className="mt-6 rounded border border-[#2D3344] bg-[#0B0C10] p-4 text-left font-mono text-xs text-[#DFB75A]">
          <div className="text-[10px] text-[#4E5569] uppercase tracking-wider mb-1">
            ANOMALY LOG:
          </div>
          <code className="text-[#C93B41] break-all">
            {error.message || "Unknown cryptographic rupture."}
          </code>
          {error.digest && (
            <div className="mt-1 text-[10px] text-[#4E5569]">
              DIGEST REF: {error.digest}
            </div>
          )}
        </div>

        {/* Recovery Actions */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <BrassButton size="md" onClick={() => reset()}>
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Re-evaluate Evidence (Retry)
          </BrassButton>
          <Link href="/dashboard">
            <Button variant="outline" size="default">
              Return to Inspector Study
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="default">
              <Home className="h-4 w-4 mr-1.5" />
              Baker St Home
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-8 font-mono text-[11px] text-[#4E5569]">
        Scotland Yard Signal Dispatch • Automated incident reporting active
      </div>
    </div>
  );
}
