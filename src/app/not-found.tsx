import Link from "next/link";
import { FogBackground } from "@/components/theme/fog-background";
import { BrassButton } from "@/components/theme/brass-button";
import { Button } from "@/components/ui/button";
import { Search, FolderX, Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-6 text-center text-[#F4EBD9]">
      <FogBackground density="heavy" />

      <div className="parchment-border relative w-full max-w-xl rounded-lg bg-[#12151C]/95 p-8 shadow-2xl backdrop-blur-md">
        {/* Red Ink Cold Case Stamp */}
        <div className="absolute -top-3 -right-3 select-none pointer-events-none">
          <div className="ink-stamp border-[#8B1E22] bg-[#3D0B0E]/90 px-3 py-1 text-xs tracking-widest text-[#C93B41]">
            COLD CASE • UNRESOLVED
          </div>
        </div>

        {/* Central Search Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#DFB75A]/60 bg-[#0B0C10] text-[#DFB75A] shadow-[0_0_20px_rgba(223,183,90,0.25)]">
          <Search className="h-8 w-8 animate-pulse text-[#DFB75A]" />
        </div>

        {/* Title & Case Dossier Ref */}
        <div className="mt-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-[#DFB75A]">
            <FolderX className="h-3.5 w-3.5" />
            <span>Archive Error #404</span>
          </div>

          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#F7F2E7] sm:text-4xl">
            Case File Missing
          </h1>

          <p className="mx-auto max-w-md text-xs text-[#D9CEB8] leading-relaxed">
            The trail has gone cold, Inspector. No evidence, witness statements,
            or telegram records exist for this coordinate in the 221B Baker
            Street Archives.
          </p>
        </div>

        {/* Crime Scene Note */}
        <div className="mt-6 rounded border border-[#2D3344] bg-[#0B0C10] p-4 text-left font-mono text-xs text-[#DFB75A]">
          <div className="text-[10px] text-[#4E5569] uppercase tracking-wider mb-1">
            FORENSIC SEARCH LOG:
          </div>
          <code>
            &gt; QUERY_STATUS: 0 MATCHES FOUND
            <br />
            &gt; RECOMMENDATION: RE-EXAMINE SCOTLAND YARD LEDGER
          </code>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/dashboard">
            <BrassButton size="md" withLoupe>
              Return to Inspector Study
            </BrassButton>
          </Link>
          <Link href="/quiz">
            <Button variant="outline" size="default">
              <Compass className="h-4 w-4 mr-1.5 text-[#DFB75A]" />
              Active Case Files
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="default">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Baker St Home
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-8 font-mono text-[11px] text-[#4E5569]">
        Scotland Yard Archive Registry • All investigations logged
      </div>
    </div>
  );
}
