import { CaseCard } from "@/components/quiz/case-card";
import { getActiveCases } from "@/api/quiz";
import { Award, Compass, Bell, Flame } from "lucide-react";

export default async function DashboardPage() {
  const activeCases = await getActiveCases();

  return (
    <div className="space-y-8">
      {/* Inspector Dossier Summary */}
      <section className="parchment-border rounded-lg bg-[#12151C] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-semibold tracking-wider text-[#DFB75A] uppercase">
              Inspector Dossier #AOT-221B
            </span>
            <h1 className="mt-1 text-2xl font-bold text-[#F7F2E7]">
              Welcome back, Detective
            </h1>
            <p className="text-xs text-[#D9CEB8]">
              Department: Computer Science & Technology • Status: Active Service
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded border border-[#2D3344] bg-[#0B0C10] p-3 text-center">
              <div className="flex items-center justify-center text-[#DFB75A]">
                <Award className="h-4 w-4" />
              </div>
              <div className="mt-1 text-lg font-bold text-[#F7F2E7]">1,450</div>
              <div className="text-[10px] text-[#D9CEB8]">Score</div>
            </div>

            <div className="rounded border border-[#2D3344] bg-[#0B0C10] p-3 text-center">
              <div className="flex items-center justify-center text-[#DFB75A]">
                <Flame className="h-4 w-4" />
              </div>
              <div className="mt-1 text-lg font-bold text-[#F7F2E7]">#4</div>
              <div className="text-[10px] text-[#D9CEB8]">Rank</div>
            </div>

            <div className="rounded border border-[#2D3344] bg-[#0B0C10] p-3 text-center">
              <div className="flex items-center justify-center text-[#2A7B54]">
                <Compass className="h-4 w-4" />
              </div>
              <div className="mt-1 text-lg font-bold text-[#F7F2E7]">6</div>
              <div className="text-[10px] text-[#D9CEB8]">Solved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Scotland Yard Telegram Despatch */}
      <section className="rounded border border-[#DFB75A]/30 bg-[#DFB75A]/5 p-4 text-xs text-[#D9CEB8]">
        <div className="flex items-center gap-2 font-semibold text-[#DFB75A]">
          <Bell className="h-4 w-4" />
          <span>SCOTLAND YARD DISPATCH #04</span>
        </div>
        <p className="mt-1">
          Attention all agencies: Case Zero is now in active investigation.
          Verify all encrypted signals through the teletype before filing
          deductions.
        </p>
      </section>

      {/* Active Cases Grid */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#F7F2E7]">
            Active Case Files
          </h2>
          <span className="text-xs text-[#DFB75A]">
            {activeCases.length} Investigation Open
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeCases.map((caseFile) => (
            <CaseCard key={caseFile.id} caseFile={caseFile} />
          ))}
        </div>
      </section>
    </div>
  );
}
