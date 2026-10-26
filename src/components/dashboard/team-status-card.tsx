import type { DetectiveAgency } from "@/types/team.types";
import { Shield, UserCheck, Users, Copy } from "lucide-react";
import Link from "next/link";
import { BrassButton } from "@/components/theme/brass-button";

interface TeamStatusCardProps {
  team: DetectiveAgency;
}

const ROLE_LABELS: Record<string, string> = {
  LEAD_INSPECTOR: "Lead Inspector",
  CRYPTANALYST: "Cryptanalyst",
  FIELD_AGENT: "Field Agent",
};

export function TeamStatusCard({ team }: TeamStatusCardProps) {
  const readyCount = team.members.filter((m) => m.isReady).length;
  const allReady = readyCount === team.members.length;

  return (
    <div className="parchment-border rounded-xl bg-[#12151C] p-6 space-y-4 h-full">
      <div className="flex items-center justify-between border-b border-[#2D3344] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[#DFB75A]" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#DFB75A]">
              Agency HQ
            </span>
          </div>
          <h2 className="mt-1 font-serif text-xl font-bold text-[#F7F2E7]">{team.name}</h2>
          {team.motto && (
            <p className="text-xs italic text-[#8892B0]">&ldquo;{team.motto}&rdquo;</p>
          )}
        </div>
        <div
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
            allReady
              ? "border-[#2A7B54] bg-[#2A7B54]/15 text-[#3EAA75]"
              : "border-[#DFB75A]/40 bg-[#DFB75A]/10 text-[#DFB75A]"
          }`}
        >
          <Shield className="h-3 w-3" />
          {allReady ? "All Ready" : `${readyCount}/${team.members.length} Ready`}
        </div>
      </div>

      {/* Passcode */}
      <div className="flex items-center justify-between rounded border border-[#2D3344] bg-[#0B0C10] px-3 py-2">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#4E5569]">Passcode</div>
          <div className="font-mono text-base font-bold tracking-widest text-[#DFB75A]">{team.passcode}</div>
        </div>
        <button
          type="button"
          title="Copy passcode"
          className="rounded border border-[#2D3344] bg-[#12151C] p-1.5 text-[#D9CEB8] transition-colors hover:text-[#DFB75A] cursor-pointer"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Member Roster */}
      <div className="space-y-2">
        {team.members.map((member) => (
          <div
            key={member.userId}
            className="flex items-center justify-between rounded-md border border-[#2D3344]/50 bg-[#161922] px-3 py-2"
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`h-2 w-2 rounded-full ${
                  member.isReady ? "bg-[#3EAA75]" : "bg-[#4E5569]"
                }`}
              />
              <div>
                <div className="text-xs font-semibold text-[#F4EBD9]">{member.fullName}</div>
                <div className="text-[10px] text-[#8892B0]">{ROLE_LABELS[member.role]}</div>
              </div>
            </div>
            <UserCheck
              className={`h-3.5 w-3.5 ${member.isReady ? "text-[#3EAA75]" : "text-[#4E5569]"}`}
            />
          </div>
        ))}
      </div>

      <Link href="/team" className="block">
        <BrassButton size="sm" className="w-full">
          Manage Agency
        </BrassButton>
      </Link>
    </div>
  );
}
