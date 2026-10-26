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
    <div className="parchment-border rounded-xl bg-surface p-6 space-y-4 h-full">
      <div className="flex items-center justify-between border-b border-fog pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-amber" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber">
              Agency HQ
            </span>
          </div>
          <h2 className="mt-1 font-serif text-xl font-bold text-parchment">
            {team.name}
          </h2>
          {team.motto && (
            <p className="text-xs italic text-muted-foreground">
              &ldquo;{team.motto}&rdquo;
            </p>
          )}
        </div>
        <div
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
            allReady
              ? "border-amber bg-amber/15 text-amber"
              : "border-amber/40 bg-amber/10 text-amber"
          }`}
        >
          <Shield className="h-3 w-3" />
          {allReady
            ? "All Ready"
            : `${readyCount}/${team.members.length} Ready`}
        </div>
      </div>

      {/* Passcode */}
      <div className="flex items-center justify-between rounded border border-fog bg-umber px-3 py-2">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Passcode
          </div>
          <div className="font-mono text-base font-bold tracking-widest text-amber">
            {team.passcode}
          </div>
        </div>
        <button
          type="button"
          title="Copy passcode"
          className="rounded border border-fog bg-surface p-1.5 text-parchment transition-colors hover:text-amber cursor-pointer"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Member Roster */}
      <div className="space-y-2">
        {team.members.map((member) => (
          <div
            key={member.userId}
            className="flex items-center justify-between rounded-md border border-fog/50 bg-surface px-3 py-2"
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`h-2 w-2 rounded-full ${
                  member.isReady ? "bg-amber" : "bg-muted-foreground"
                }`}
              />
              <div>
                <div className="text-xs font-semibold text-parchment">
                  {member.fullName}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {ROLE_LABELS[member.role]}
                </div>
              </div>
            </div>
            <UserCheck
              className={`h-3.5 w-3.5 ${member.isReady ? "text-amber" : "text-muted-foreground"}`}
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
