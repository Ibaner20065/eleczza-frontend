import Link from "next/link";
import { MOCK_EVENT, MOCK_MY_TEAM } from "@/lib/mock-data";
import { DashboardCountdown } from "@/components/dashboard/dashboard-countdown";
import { TeamStatusCard } from "@/components/dashboard/team-status-card";
import { CaseFileCard } from "@/components/theme/case-file-card";
import { BrassButton } from "@/components/theme/brass-button";
import { Bell, Trophy, Shield, ChevronRight } from "lucide-react";

export default function DashboardPage() {
  const event = MOCK_EVENT;
  const myTeam = MOCK_MY_TEAM;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <section className="wood-panel rounded-xl p-6 shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber">
                Inspector Study • 221B Bureau
              </span>
            </div>
            <h1 className="font-display text-3xl font-extrabold tracking-wide text-parchment">
              {event.title}
            </h1>
            <p className="max-w-lg text-sm text-parchment leading-relaxed">
              {event.description}
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-muted-foreground">
              <span>📍 {event.venue}</span>
              <span>👥 {event.totalTeams} Agencies</span>
              <span>
                🏆 Prize Pool:{" "}
                <strong className="text-amber">{event.prizePool}</strong>
              </span>
              <span>👤 Max {event.maxTeamSize} per Agency</span>
            </div>
          </div>

          <div className="shrink-0">
            <DashboardCountdown targetIso={event.startsAt} />
          </div>
        </div>
      </section>

      {/* Scotland Yard Dispatch */}
      <section className="flex items-start gap-3 rounded-lg border border-amber/30 bg-amber/5 p-4 text-xs">
        <Bell className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
        <div>
          <div className="font-mono font-bold uppercase tracking-wider text-amber">
            Scotland Yard Dispatch #05
          </div>
          <p className="mt-0.5 text-parchment">
            All agencies must be registered and ready before the event starts.
            The quiz locks 60 seconds after start. Ensure all team members have
            joined.
          </p>
        </div>
      </section>

      {/* Grid: Team Status + Active Cases */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Team Status */}
        <div className="lg:col-span-5">
          <TeamStatusCard team={myTeam} />
        </div>

        {/* Active Case Files */}
        <div className="space-y-4 lg:col-span-7">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-parchment">
              Active Investigation Files
            </h2>
            <Link
              href="/leaderboard"
              className="flex items-center gap-1 text-xs font-semibold text-amber hover:underline"
            >
              <Trophy className="h-3.5 w-3.5" />
              Scotland Yard Ledger
            </Link>
          </div>

          <CaseFileCard
            caseNumber="005"
            title="Case #005: The Final Problem"
            synopsis="A cryptographic anomaly has been detected across the Academy of Technology laboratory network. Five interconnected dossiers await your deduction."
            difficulty="Moriarty"
            points={1200}
            durationMinutes={45}
            stampText="LIVE"
            action={
              <Link href="/quiz/lobby">
                <BrassButton size="sm" withLoupe>
                  Enter Lobby
                </BrassButton>
              </Link>
            }
          />

          {/* Quick Nav Tiles */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Agency HQ", href: "/team", icon: "👥" },
              { label: "Case Lobby", href: "/quiz/lobby", icon: "🔍" },
              {
                label: "Scotland Yard Ledger",
                href: "/leaderboard",
                icon: "🏆",
              },
            ].map((tile) => (
              <Link
                key={tile.href}
                href={tile.href}
                className="wood-panel flex flex-col items-center justify-center gap-2 rounded-lg p-4 text-center transition-all hover:border-amber/50"
              >
                <span className="text-2xl">{tile.icon}</span>
                <span className="text-xs font-semibold text-parchment">
                  {tile.label}
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
