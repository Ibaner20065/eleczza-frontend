import type { DetectiveAgency } from "@/types/team.types";

export interface EventInfo {
  id: string;
  name: string;
  description: string;
  startsAt: string;
  endsAt: string;
  status: "UPCOMING" | "LIVE" | "COMPLETED";
}

export interface QuizQuestion {
  id: string;
  order: number;
  prompt: string;
  options: string[];
  points: number;
  durationSeconds: number;
}

export interface QuizProgress {
  status: "LOBBY" | "IN_PROGRESS" | "COMPLETED";
  questionIndex: number;
  questionStartedAt: string | null;
  answers: Record<string, number>;
  score: number;
  correctCount: number;
  completedAt: string | null;
}

export interface AnswerSubmission {
  submissionId: string;
  questionId: string;
  optionIndex: number;
}

export interface AnswerResult {
  correct: boolean;
  awardedPoints: number;
  score: number;
  correctCount: number;
  progress: QuizProgress;
}

export interface LeaderboardEntry {
  teamId: string;
  teamName: string;
  leaderName: string;
  score: number;
  solvedCount: number;
  rank: number;
}

export interface EventSnapshot {
  event: EventInfo;
  agency: DetectiveAgency | null;
  readyTeams: number;
  totalTeams: number;
  progress: QuizProgress;
}
