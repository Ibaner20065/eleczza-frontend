"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Flame } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { LeaderboardEntry } from "@/types/event.types";

export default function LeaderboardTable({
  rankings,
  agencyId,
}: {
  rankings: LeaderboardEntry[];
  agencyId: string | null;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="parchment-border overflow-hidden rounded-lg bg-[#12151C]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <caption className="sr-only">Current event leaderboard</caption>
          <thead className="border-b border-[#2D3344] bg-[#0B0C10] tracking-wider text-[#D9CEB8] uppercase">
            <tr>
              <th scope="col" className="px-4 py-3">
                Rank
              </th>
              <th scope="col" className="px-4 py-3">
                Agency
              </th>
              <th scope="col" className="px-4 py-3">
                Lead Operative
              </th>
              <th scope="col" className="px-4 py-3">
                Deductions verified
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Score
              </th>
            </tr>
          </thead>
          <motion.tbody
            className="divide-y divide-[#2D3344]/50 text-[#D9CEB8]"
            layout={!reducedMotion}
          >
            <AnimatePresence initial={false}>
              {rankings.map((entry) => {
                const isOwnTeam = agencyId === entry.teamId;
                return (
                  <motion.tr
                    key={entry.teamId}
                    layout={!reducedMotion}
                    initial={reducedMotion ? false : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reducedMotion ? undefined : { opacity: 0, x: 8 }}
                    transition={{ duration: reducedMotion ? 0 : 0.25 }}
                    aria-current={isOwnTeam ? "true" : undefined}
                    className={
                      isOwnTeam
                        ? "leaderboard-row-own bg-[#DFB75A]/15 text-[#F7F2E7]"
                        : "leaderboard-row transition-colors hover:bg-[#1C202B]/60"
                    }
                  >
                    <td className="px-4 py-3 font-bold text-[#F7F2E7]">
                      <span className="flex items-center gap-1.5">
                        {entry.rank <= 3 && (
                          <Flame
                            aria-hidden="true"
                            className="h-3.5 w-3.5 text-[#DFB75A]"
                          />
                        )}
                        #{entry.rank}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-[#F7F2E7]">
                      {entry.teamName}
                      {isOwnTeam && (
                        <span className="ml-2 rounded border border-[#F3D88C] px-2 py-1 text-[10px] font-semibold tracking-wider text-[#F3D88C] uppercase">
                          Your agency
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">{entry.leaderName}</td>
                    <td className="px-4 py-3">{entry.solvedCount}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-[#DFB75A]">
                      {entry.score}
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </motion.tbody>
        </table>
      </div>
      {rankings.length === 0 && (
        <p className="p-6 text-center text-sm text-[#8892B0]">
          No agencies have filed a report yet.
        </p>
      )}
    </div>
  );
}
