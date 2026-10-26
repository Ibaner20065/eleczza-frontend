import React from "react";
import { ShieldAlert } from "lucide-react";

export function DomainNotice() {
  const domain = process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN || "@aot.edu.in";

  return (
    <div className="flex items-center gap-2.5 rounded border border-amber/30 bg-umber px-3.5 py-2.5 text-xs text-parchment">
      <ShieldAlert className="h-4 w-4 shrink-0 text-amber" />
      <span>
        Restricted to verified Academy of Technology inspectors (
        <strong className="text-parchment">{domain}</strong>).
      </span>
    </div>
  );
}
