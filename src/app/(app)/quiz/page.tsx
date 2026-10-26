"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  deductionSubmissionSchema,
  type DeductionSubmissionInput,
} from "@/lib/validators/quiz";
import { PocketWatchTimer } from "@/components/quiz/pocket-watch-timer";
import { Button } from "@/components/ui/button";
import { Search, Lightbulb, FileText, Send } from "lucide-react";

export default function QuizPage() {
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DeductionSubmissionInput>({
    resolver: zodResolver(deductionSubmissionSchema),
    defaultValues: {
      caseId: "7b4c6e91-8840-4dc6-a36a-f0e21a2c678a",
      questionId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    },
  });

  const onSubmit = async (data: DeductionSubmissionInput) => {
    console.log("Filing deduction:", data);
    setSubmissionFeedback(
      "Deduction filed with Scotland Yard. Verdict pending verification...",
    );
    reset();
  };

  return (
    <div className="space-y-6">
      {/* Top HUD */}
      <div className="flex flex-col gap-4 border-b border-fog pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-semibold tracking-wider text-amber uppercase">
            Active Investigation • Clue #03 of 10
          </span>
          <h1 className="font-script text-2xl leading-tight text-parchment">
            Case #001: The Hound of the North Lawn
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right text-xs">
            <span className="text-parchment">Current Bounty:</span>
            <span className="ml-1 font-bold text-amber">500 pts</span>
          </div>
          <PocketWatchTimer initialSeconds={2700} />
        </div>
      </div>

      {/* Split Pane: Left Clues / Right Deduction */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Pane: Evidence Locker (7 cols) */}
        <div className="wood-panel space-y-4 rounded-lg p-6 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-fog pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-amber" />
              <h2 className="text-sm font-bold tracking-wider text-parchment uppercase">
                Archived Evidence
              </h2>
            </div>
            <span className="text-xs text-parchment">Document Ref: EX-402</span>
          </div>

          <div className="space-y-3 text-sm leading-relaxed text-parchment">
            <p>
              At 23:42 hours, an irregular signal oscillation was detected
              across the server racks in Room 304. The night watchman reported
              the faint aroma of burnt copper and an unfamiliar morse broadcast
              pulsing across the emergency frequency.
            </p>

            <div className="rounded border border-fog bg-umber/80 p-4 font-mono text-xs text-amber">
              <code>
                [TRANSMISSION LOG // BAKER_NET]
                <br />
                01000001 01001111 01010100 00110010 00110010 00110001 01000010
                <br />
                &gt;&gt; CIPHER_KEY: ROT-13(NORTH_WING)
              </code>
            </div>

            <p>
              Interrogate the transmission above to identify the origin
              department responsible for initiating the relay.
            </p>
          </div>

          {/* Hint Requisition */}
          <div className="mt-6 rounded border border-amber/30 bg-amber/10 p-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-amber">
                <Lightbulb className="h-4 w-4" />
                <span>Baker Street Irregular Telegram (Hint)</span>
              </div>
              <button
                type="button"
                className="text-[11px] font-semibold text-amber hover:underline"
              >
                Requisition Hint (-50 pts)
              </button>
            </div>
          </div>
        </div>

        {/* Right Pane: Deduction Console (5 cols) */}
        <div className="wood-panel space-y-4 rounded-lg p-6 lg:col-span-5">
          <div className="flex items-center gap-2 border-b border-fog pb-3">
            <Search className="h-4 w-4 text-amber" />
            <h2 className="text-sm font-bold tracking-wider text-parchment uppercase">
              File Deduction
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold tracking-wider text-parchment uppercase">
                Your Forensic Deduction / Cipher Key
              </label>
              <textarea
                {...register("deduction")}
                rows={4}
                placeholder="Enter decrypted string, key, or conclusion..."
                className="field-control mt-1 w-full rounded border border-fog bg-umber p-3 text-sm text-parchment placeholder-muted-foreground focus:border-amber focus:outline-none"
              />
              {errors.deduction && (
                <p className="mt-1 text-xs text-wax-foreground">
                  {errors.deduction.message}
                </p>
              )}
            </div>

            {submissionFeedback && (
              <div className="rounded border border-amber/50 bg-amber/10 p-3 text-xs text-amber">
                {submissionFeedback}
              </div>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? "Dispatching..." : "Submit Deduction"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
