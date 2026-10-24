import React from "react";
import { ShieldAlert } from "lucide-react";

export function DomainNotice() {
  const domain = process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN || "@aot.edu.in";

  return (
    <div className="flex items-center gap-2.5 rounded border border-[#DFB75A]/30 bg-[#14161D] px-3.5 py-2.5 text-xs text-[#D9CEB8]">
      <ShieldAlert className="h-4 w-4 shrink-0 text-[#DFB75A]" />
      <span>
        Restricted to verified Academy of Technology inspectors (
        <strong className="text-[#F7F2E7]">{domain}</strong>).
      </span>
    </div>
  );
}
