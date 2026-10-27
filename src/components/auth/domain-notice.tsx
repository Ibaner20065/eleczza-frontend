import React from "react";
import { ShieldAlert } from "lucide-react";

export function DomainNotice() {
  const domain = process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN || "@aot.edu.in";

  return (
    <div className="flex items-center gap-2.5 rounded-sm border border-amber/30 bg-[#120c08] px-3.5 py-2.5 font-serif text-xs text-parchment/85 shadow-sm">
      <ShieldAlert className="h-4 w-4 shrink-0 text-amber" />
      <span>
        Restricted to verified Academy of Technology inspectors (
        <strong className="font-mono text-amber font-semibold">{domain}</strong>
        ).
      </span>
    </div>
  );
}
