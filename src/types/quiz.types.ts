export type QuestionType = "MULTIPLE_CHOICE" | "CIPHER_TEXT" | "EVIDENCE_MATCH";

export interface ClueItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  isUnlocked: boolean;
  costPoints?: number;
}

export interface Question {
  id: string;
  order: number;
  title: string;
  prompt: string;
  type: QuestionType;
  options?: string[];
  points: number;
  penaltyPerAttempt: number;
  clues: ClueItem[];
}

export interface CaseFile {
  id: string;
  slug: string;
  title: string;
  briefing: string;
  difficulty: "Elementary" | "Puzzling" | "Labyrinthine" | "Moriarty";
  durationMinutes: number;
  startsAt: string;
  endsAt: string;
  isLive: boolean;
  isSolved: boolean;
  totalPoints: number;
  questions: Question[];
}

export interface DeductionResult {
  correct: boolean;
  message: string;
  awardedPoints: number;
  penaltyPoints: number;
  remainingAttempts: number;
}
