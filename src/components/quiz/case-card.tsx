import Link from "next/link";
import { FolderLock, ArrowRight, Award } from "lucide-react";
import type { CaseFile } from "@/types/quiz.types";

interface CaseCardProps {
  caseFile: CaseFile;
}

export function CaseCard({ caseFile }: CaseCardProps) {
  return (
    <div className="parchment-border group relative rounded-lg bg-surface p-6 transition-all hover:border-amber/60">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <FolderLock className="h-5 w-5 text-amber" />
          <span className="text-xs font-semibold tracking-wider text-amber uppercase">
            {caseFile.difficulty} Case
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-parchment">
          <Award className="h-4 w-4 text-amber" />
          <span>{caseFile.totalPoints} pts</span>
        </div>
      </div>

      <h3 className="mt-4 text-xl font-bold text-parchment transition-colors group-hover:text-amber">
        {caseFile.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm text-parchment">
        {caseFile.briefing}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-fog pt-4">
        <span className="text-xs text-parchment">
          Duration: {caseFile.durationMinutes}m
        </span>
        <Link
          href={`/quiz?caseId=${caseFile.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-amber hover:underline"
        >
          Inspect Dossier
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
