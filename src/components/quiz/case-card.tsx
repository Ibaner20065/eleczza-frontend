import Link from "next/link";
import { FolderLock, ArrowRight, Award } from "lucide-react";
import type { CaseFile } from "@/types/quiz.types";

interface CaseCardProps {
  caseFile: CaseFile;
}

export function CaseCard({ caseFile }: CaseCardProps) {
  return (
    <div className="parchment-border group relative rounded-lg bg-[#12151C] p-6 transition-all hover:border-[#DFB75A]/60">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <FolderLock className="h-5 w-5 text-[#DFB75A]" />
          <span className="text-xs font-semibold tracking-wider text-[#DFB75A] uppercase">
            {caseFile.difficulty} Case
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#D9CEB8]">
          <Award className="h-4 w-4 text-[#DFB75A]" />
          <span>{caseFile.totalPoints} pts</span>
        </div>
      </div>

      <h3 className="mt-4 text-xl font-bold text-[#F7F2E7] transition-colors group-hover:text-[#DFB75A]">
        {caseFile.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm text-[#D9CEB8]">
        {caseFile.briefing}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-[#2D3344] pt-4">
        <span className="text-xs text-[#D9CEB8]">
          Duration: {caseFile.durationMinutes}m
        </span>
        <Link
          href={`/quiz?caseId=${caseFile.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#DFB75A] hover:underline"
        >
          Inspect Dossier
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
