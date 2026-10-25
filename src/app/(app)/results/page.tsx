"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, Target, Trophy } from "lucide-react";
import { getEventInfo, getQuizProgress, quizQuestions } from "@/api/event";
import type { EventInfo, QuizProgress } from "@/types/event.types";
import { BrassButton } from "@/components/theme/brass-button";

export default function ResultsPage() {
  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null);
  const [progress, setProgress] = useState<QuizProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([getEventInfo(), getQuizProgress()])
      .then(([eventData, quizProgress]) => {
        if (!active) return;
        setEventInfo(eventData);
        setProgress(quizProgress);
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to retrieve your case report.",
        );
      });
    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <p
        role="alert"
        className="rounded border border-[#9E2A2B]/60 bg-[#9E2A2B]/10 p-4 text-sm text-[#F7B7B7]"
      >
        {error}
      </p>
    );
  }
  if (!eventInfo || !progress) {
    return (
      <p role="status" className="text-sm text-[#D9CEB8]">
        Preparing your final report…
      </p>
    );
  }
  if (progress.status !== "COMPLETED") {
    return (
      <section className="parchment-border mx-auto max-w-xl rounded-lg bg-[#12151C] p-8 text-center">
        <Target className="mx-auto h-9 w-9 text-[#DFB75A]" />
        <h1 className="mt-4 text-2xl font-bold text-[#F7F2E7]">
          The case is still open
        </h1>
        <p className="mt-2 text-sm text-[#D9CEB8]">
          Complete the active investigation before viewing your final report.
        </p>
        <Link
          href="/quiz"
          className="mt-5 inline-flex text-sm font-semibold text-[#DFB75A] hover:underline"
        >
          Return to the bureau <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </section>
    );
  }

  const accuracy = Math.round(
    (progress.correctCount / quizQuestions.length) * 100,
  );

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="text-center">
        <span className="text-xs font-semibold tracking-widest text-[#DFB75A] uppercase">
          Scotland Yard · Final report
        </span>
        <h1 className="mt-2 text-3xl font-bold text-[#F7F2E7]">
          {eventInfo.name}
        </h1>
      </div>

      <section className="gaslamp-glow parchment-border relative overflow-hidden rounded-lg p-8 text-center sm:p-12">
        <div
          className="motion-safe:animate-[stamp-in_500ms_ease-out_200ms_both] ink-stamp absolute right-6 top-6 text-sm sm:right-10 sm:top-10 sm:text-base"
          aria-label="Case closed"
        >
          CASE CLOSED
        </div>
        <BadgeCheck className="mx-auto h-12 w-12 text-[#DFB75A]" />
        <p className="mt-5 text-xs font-semibold tracking-widest text-[#D9CEB8] uppercase">
          Investigation filed
        </p>
        <div className="mt-3 font-mono text-5xl font-bold text-[#DFB75A]">
          {progress.score}
        </div>
        <p className="mt-1 text-sm text-[#D9CEB8]">points awarded</p>
        <div className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-3">
          <div className="rounded border border-[#2D3344] bg-[#0B0C10]/70 p-4">
            <div className="text-2xl font-bold text-[#F7F2E7]">
              {progress.correctCount}/{quizQuestions.length}
            </div>
            <div className="mt-1 text-[10px] tracking-widest text-[#8892B0] uppercase">
              Deductions verified
            </div>
          </div>
          <div className="rounded border border-[#2D3344] bg-[#0B0C10]/70 p-4">
            <div className="text-2xl font-bold text-[#F7F2E7]">{accuracy}%</div>
            <div className="mt-1 text-[10px] tracking-widest text-[#8892B0] uppercase">
              Accuracy
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/leaderboard">
            <BrassButton>
              <Trophy className="h-4 w-4" /> View leaderboard
            </BrassButton>
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-[#2D3344] px-4 text-xs font-semibold text-[#D9CEB8] hover:border-[#DFB75A]/50 hover:text-[#DFB75A]"
          >
            Return to dashboard
          </Link>
        </div>
      </section>

      <p className="text-center text-xs text-[#8892B0]">
        Filed{" "}
        {progress.completedAt
          ? new Date(progress.completedAt).toLocaleString()
          : "with the bureau"}
        .
      </p>
    </div>
  );
}
