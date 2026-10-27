import { apiRequest, type ApiResponse } from "@/api/client";
import { SAMPLE_ARENAS } from "@/lib/quiz/sample-data";
import type { Arena } from "@/types/arena.types";
import type { CaseFile, DeductionResult } from "@/types/quiz.types";
import type { DeductionSubmissionInput } from "@/lib/validators/quiz";

export function getArenas(): Promise<ApiResponse<Arena[]>> {
  return apiRequest<Arena[]>("/arenas", { method: "GET" }, SAMPLE_ARENAS);
}

export async function getActiveCases(): Promise<CaseFile[]> {
  return [
    {
      id: "7b4c6e91-8840-4dc6-a36a-f0e21a2c678a",
      slug: "the-hound-of-baskerville",
      title: "Case #001: The Hound of the North Lawn",
      briefing:
        "Strange prints and high-frequency noise have disrupted the laboratory at midnight. Interrogate the evidence log.",
      difficulty: "Elementary",
      durationMinutes: 45,
      startsAt: "2026-10-25T10:00:00.000Z",
      endsAt: "2026-10-25T11:00:00.000Z",
      isLive: true,
      isSolved: false,
      totalPoints: 500,
      questions: [],
    },
  ];
}

export async function submitDeduction(
  input: DeductionSubmissionInput,
): Promise<DeductionResult> {
  void input;
  return {
    correct: true,
    message: "Elementary! Deduction verified against archival records.",
    awardedPoints: 100,
    penaltyPoints: 0,
    remainingAttempts: 2,
  };
}
