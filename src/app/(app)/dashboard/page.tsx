"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Activity, ArrowRight, Clock3, Shield, Users } from "lucide-react";
import { getEventSnapshot } from "@/api/event";
import type { EventSnapshot } from "@/types/event.types";
import { BrassButton } from "@/components/theme/brass-button";
import { useUser } from "@/hooks/use-auth";

function formatCountdown(target: string, now: number) {
  const distance = Math.max(0, new Date(target).getTime() - now);
  const days = Math.floor(distance / 86_400_000);
  const hours = Math.floor((distance % 86_400_000) / 3_600_000);
  const minutes = Math.floor((distance % 3_600_000) / 60_000);
  const seconds = Math.floor((distance % 60_000) / 1_000);
  return { days, hours, minutes, seconds };
}

export default function DashboardPage() {
  const { user } = useUser();
  const [snapshot, setSnapshot] = useState<EventSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(0);

  const refresh = useCallback(async () => {
    try {
      setSnapshot(await getEventSnapshot(user?.id));
      setError(null);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load event status.",
      );
    }
  }, [user]);

  useEffect(() => {
    void Promise.resolve().then(refresh);
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    const poll = window.setInterval(() => void refresh(), 15_000);
    window.addEventListener("eleczza:event-updated", refresh);
    return () => {
      window.clearInterval(timer);
      window.clearInterval(poll);
      window.removeEventListener("eleczza:event-updated", refresh);
    };
  }, [refresh]);

  if (!snapshot && !error) {
    return (
      <p className="text-sm text-[#D9CEB8]" role="status">
        Retrieving event dossier…
      </p>
    );
  }

  const countdown =
    snapshot && now > 0 ? formatCountdown(snapshot.event.startsAt, now) : null;
  const eventStarted =
    snapshot && now > 0
      ? new Date(snapshot.event.startsAt).getTime() <= now
      : false;
  const statusLabel =
    snapshot?.progress.status === "COMPLETED"
      ? "Case filed"
      : snapshot?.progress.status === "IN_PROGRESS"
        ? "Investigation active"
        : snapshot?.agency
          ? snapshot.agency.members.every((member) => member.isReady)
            ? "Agency ready"
            : "Awaiting inspectors"
          : "No agency assigned";

  return (
    <div className="space-y-8">
      {error && (
        <div
          role="alert"
          className="rounded border border-[#9E2A2B]/60 bg-[#9E2A2B]/10 p-3 text-sm text-[#F7B7B7]"
        >
          {error}
          <button
            type="button"
            onClick={() => void refresh()}
            className="ml-3 underline"
          >
            Retry
          </button>
        </div>
      )}
      {snapshot && (
        <>
          <section className="gaslamp-glow parchment-border rounded-lg p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <span className="text-xs font-semibold tracking-wider text-[#DFB75A] uppercase">
                  Inspector Dossier · {snapshot.event.status}
                </span>
                <h1 className="mt-2 text-3xl font-bold text-[#F7F2E7] sm:text-4xl">
                  {snapshot.event.name}
                </h1>
                <p className="mt-3 text-sm leading-6 text-[#D9CEB8]">
                  {snapshot.event.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={snapshot.agency ? "/quiz" : "/team"}>
                    <BrassButton withLoupe size="lg">
                      {snapshot.progress.status === "COMPLETED"
                        ? "Review results"
                        : snapshot.agency
                          ? "Enter the bureau"
                          : "Assemble your team"}
                    </BrassButton>
                  </Link>
                  {snapshot.agency && (
                    <Link
                      href="/team"
                      className="inline-flex h-11 items-center gap-2 rounded-md border border-[#DFB75A]/40 px-4 text-sm font-semibold text-[#DFB75A] transition-colors hover:bg-[#DFB75A]/10"
                    >
                      Agency roster <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
              <div className="min-w-64 rounded-lg border border-[#DFB75A]/30 bg-[#0B0C10]/70 p-5">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#D9CEB8] uppercase">
                  <Clock3 className="h-4 w-4 text-[#DFB75A]" />
                  {eventStarted ? "Bureau is live" : "Countdown to opening"}
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2 text-center font-mono">
                  {[
                    ["Days", countdown?.days ?? "—"],
                    ["Hours", countdown?.hours ?? "—"],
                    ["Mins", countdown?.minutes ?? "—"],
                    ["Secs", countdown?.seconds ?? "—"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded border border-[#2D3344] bg-[#12151C] px-2 py-3"
                    >
                      <div className="text-xl font-bold text-[#DFB75A]">
                        {String(value).padStart(2, "0")}
                      </div>
                      <div className="mt-1 text-[9px] tracking-widest text-[#8892B0] uppercase">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[11px] text-[#8892B0]">
                  {new Date(snapshot.event.startsAt).toLocaleString()}
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <article className="parchment-border rounded-lg bg-[#12151C] p-5">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#DFB75A] uppercase">
                <Activity className="h-4 w-4" /> Team status
              </div>
              <p className="mt-3 text-xl font-bold text-[#F7F2E7]">
                {statusLabel}
              </p>
              <p className="mt-1 text-xs text-[#D9CEB8]">
                {snapshot.agency
                  ? snapshot.agency.name
                  : "Create an agency or join with an invite code."}
              </p>
            </article>
            <article className="parchment-border rounded-lg bg-[#12151C] p-5">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#DFB75A] uppercase">
                <Users className="h-4 w-4" /> Agencies ready
              </div>
              <p className="mt-3 text-xl font-bold text-[#F7F2E7]">
                {snapshot.readyTeams}{" "}
                <span className="text-sm font-normal text-[#8892B0]">
                  / {snapshot.totalTeams}
                </span>
              </p>
              <p className="mt-1 text-xs text-[#D9CEB8]">
                The detective bureau is gathering its teams.
              </p>
            </article>
            <article className="parchment-border rounded-lg bg-[#12151C] p-5">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#DFB75A] uppercase">
                <Shield className="h-4 w-4" /> Case progress
              </div>
              <p className="mt-3 text-xl font-bold text-[#F7F2E7]">
                {snapshot.progress.status === "COMPLETED"
                  ? "Case closed"
                  : snapshot.progress.status === "IN_PROGRESS"
                    ? `Question ${Math.min(snapshot.progress.questionIndex + 1, 3)} of 3`
                    : "Awaiting briefing"}
              </p>
              <p className="mt-1 text-xs text-[#D9CEB8]">
                {snapshot.progress.score} points recorded
              </p>
            </article>
          </section>
        </>
      )}
    </div>
  );
}
