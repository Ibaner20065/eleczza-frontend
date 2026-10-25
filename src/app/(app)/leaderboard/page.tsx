"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getLeaderboard } from "@/api/event";
import { getAgencyRoster } from "@/api/team";
import type { LeaderboardEntry } from "@/types/event.types";
import type { DetectiveAgency } from "@/types/team.types";
import { useUser } from "@/hooks/use-auth";

const LeaderboardTable = dynamic(
  () => import("@/components/leaderboard/leaderboard-table"),
  {
    loading: () => (
      <p role="status" className="text-sm text-[#D9CEB8]">
        Loading bureau standings…
      </p>
    ),
  },
);

export default function LeaderboardPage() {
  const { user } = useUser();
  const [rankings, setRankings] = useState<LeaderboardEntry[]>([]);
  const [agency, setAgency] = useState<DetectiveAgency | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [entries, roster] = await Promise.all([
        getLeaderboard(),
        getAgencyRoster(user?.id),
      ]);
      setRankings([...entries].sort((a, b) => a.rank - b.rank));
      setAgency(roster);
      setError(null);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to retrieve bureau rankings.",
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void Promise.resolve().then(refresh);
    const interval = window.setInterval(() => void refresh(), 10_000);
    window.addEventListener("eleczza:event-updated", refresh);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("eleczza:event-updated", refresh);
    };
  }, [refresh]);

  return (
    <div className="space-y-5">
      <div>
        <span className="text-xs font-semibold tracking-wider text-[#DFB75A] uppercase">
          Scotland Yard Official Ledger
        </span>
        <h1 className="mt-1 text-2xl font-bold text-[#F7F2E7]">
          High Table of Detectives
        </h1>
        <p className="text-xs text-[#D9CEB8]">
          Live telemetry ranking agencies by score and verified deductions.
          Refreshes every 10 seconds.
        </p>
      </div>

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

      {loading && rankings.length === 0 ? (
        <p role="status" className="text-sm text-[#D9CEB8]">
          Consulting the official ledger…
        </p>
      ) : (
        <LeaderboardTable rankings={rankings} agencyId={agency?.id ?? null} />
      )}
    </div>
  );
}
