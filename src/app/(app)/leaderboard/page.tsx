import { Trophy, Medal, Flame } from "lucide-react";

interface RankingEntry {
  rank: number;
  agencyName: string;
  leadInspector: string;
  score: number;
  solvedCount: number;
  solveTime: string;
}

const mockRankings: RankingEntry[] = [
  {
    rank: 1,
    agencyName: "The Baker Street Irregulars",
    leadInspector: "S. Holmes (ECE)",
    score: 2850,
    solvedCount: 10,
    solveTime: "34m 12s",
  },
  {
    rank: 2,
    agencyName: "Diogenes Society",
    leadInspector: "M. Holmes (ECE)",
    score: 2600,
    solvedCount: 9,
    solveTime: "41m 05s",
  },
  {
    rank: 3,
    agencyName: "The Norwood Syndicate",
    leadInspector: "J. McFarlane (IT)",
    score: 2450,
    solvedCount: 9,
    solveTime: "44m 30s",
  },
  {
    rank: 4,
    agencyName: "The Baskerville Syndicate",
    leadInspector: "H. Baskerville (EE)",
    score: 2100,
    solvedCount: 8,
    solveTime: "49m 18s",
  },
  {
    rank: 5,
    agencyName: "Red-Headed League",
    leadInspector: "J. Wilson (ME)",
    score: 1850,
    solvedCount: 7,
    solveTime: "52m 00s",
  },
];

export default function LeaderboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-semibold tracking-wider text-[#DFB75A] uppercase">
          Scotland Yard Official Ledger
        </span>
        <h1 className="mt-1 text-2xl font-bold text-[#F7F2E7]">
          High Table of Detectives
        </h1>
        <p className="text-xs text-[#D9CEB8]">
          Live telemetry ranking agencies across the Academy by score, speed,
          and accuracy.
        </p>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {mockRankings.slice(0, 3).map((agency) => (
          <div
            key={agency.rank}
            className={`parchment-border relative rounded-lg p-5 text-center ${
              agency.rank === 1
                ? "brass-glow border-[#DFB75A] bg-[#14161D]"
                : "bg-[#12151C]"
            }`}
          >
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#DFB75A]/60 bg-[#0B0C10]">
              {agency.rank === 1 ? (
                <Trophy className="h-5 w-5 text-[#DFB75A]" />
              ) : (
                <Medal className="h-5 w-5 text-[#D9CEB8]" />
              )}
            </div>

            <div className="mt-3 text-xs font-semibold tracking-wider text-[#DFB75A] uppercase">
              Rank #{agency.rank}
            </div>
            <div className="mt-1 font-bold text-[#F7F2E7]">
              {agency.agencyName}
            </div>
            <div className="text-xs text-[#D9CEB8]">{agency.leadInspector}</div>

            <div className="mt-4 border-t border-[#2D3344] pt-3 text-sm font-bold text-[#DFB75A]">
              {agency.score} pts
            </div>
          </div>
        ))}
      </div>

      {/* Full Ledger Table */}
      <div className="parchment-border overflow-hidden rounded-lg bg-[#12151C]">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[#2D3344] bg-[#0B0C10] tracking-wider text-[#D9CEB8] uppercase">
            <tr>
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Agency</th>
              <th className="px-4 py-3">Lead Operative</th>
              <th className="px-4 py-3">Cases Solved</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3 text-right">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2D3344]/50 text-[#D9CEB8]">
            {mockRankings.map((entry) => (
              <tr
                key={entry.rank}
                className="transition-colors hover:bg-[#1C202B]/60"
              >
                <td className="px-4 py-3 font-bold text-[#F7F2E7]">
                  <span className="flex items-center gap-1.5">
                    {entry.rank <= 3 && (
                      <Flame className="h-3.5 w-3.5 text-[#DFB75A]" />
                    )}
                    #{entry.rank}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-[#F7F2E7]">
                  {entry.agencyName}
                </td>
                <td className="px-4 py-3">{entry.leadInspector}</td>
                <td className="px-4 py-3">{entry.solvedCount} cases</td>
                <td className="px-4 py-3 font-mono">{entry.solveTime}</td>
                <td className="px-4 py-3 text-right font-mono font-bold text-[#DFB75A]">
                  {entry.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
