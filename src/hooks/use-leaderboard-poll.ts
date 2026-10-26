"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { MOCK_LEADERBOARD, type LeaderboardEntry } from "@/lib/mock-data";

function shuffleRanks(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  // Simulate minor score changes for demo
  return entries
    .map((e) => ({
      ...e,
      score: e.score + Math.floor(Math.random() * 30 - 10),
    }))
    .sort((a, b) => b.score - a.score)
    .map((e, i) => ({ ...e, rank: i + 1 }));
}

export function useLeaderboardPoll(intervalMs = 8000) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(MOCK_LEADERBOARD);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isPolling, setIsPolling] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const refresh = useCallback(() => {
    setEntries((prev) => shuffleRanks(prev));
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    if (!isPolling) return;
    timerRef.current = setInterval(refresh, intervalMs);
    return () => clearInterval(timerRef.current!);
  }, [isPolling, intervalMs, refresh]);

  return {
    entries,
    lastUpdated,
    isPolling,
    refresh,
    togglePolling: () => setIsPolling((v) => !v),
  };
}
