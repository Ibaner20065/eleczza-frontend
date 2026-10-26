"use client";
import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import type { Question } from "@/types/quiz.types";
import { MOCK_QUESTIONS } from "@/lib/mock-data";

export type QuizPhase = "lobby" | "question" | "transitioning" | "results";

export interface AnswerRecord {
  questionId: string;
  selectedOption: string;
  submittedAt: string;
  correct?: boolean;
  pointsEarned?: number;
}

export interface QuizState {
  phase: QuizPhase;
  questions: Question[];
  currentIndex: number;
  currentQuestion: Question | null;
  answers: AnswerRecord[];
  isOnline: boolean;
  isLocked: boolean; // answer locked in, awaiting server ack
  timeRemainingSeconds: number;
  totalSeconds: number;
  teamReady: boolean;
}

// Use localStorage key to persist state on reconnect
const STATE_KEY = "eleczza_quiz_state";

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isAnswerRecord(value: unknown): value is AnswerRecord {
  return (
    isRecord(value) &&
    typeof value.questionId === "string" &&
    typeof value.selectedOption === "string" &&
    typeof value.submittedAt === "string" &&
    (value.correct === undefined || typeof value.correct === "boolean") &&
    (value.pointsEarned === undefined || typeof value.pointsEarned === "number")
  );
}

function subscribeToNetworkStatus(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);

  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

function getNetworkStatus() {
  return navigator.onLine;
}

function getServerNetworkStatus() {
  return true;
}

export function useQuizState(caseId: string) {
  const [phase, setPhase] = useState<QuizPhase>("lobby");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const isOnline = useSyncExternalStore(
    subscribeToNetworkStatus,
    getNetworkStatus,
    getServerNetworkStatus,
  );
  const [isLocked, setIsLocked] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(45 * 60);
  const [teamReady, setTeamReady] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [pendingAnswer, setPendingAnswer] = useState<string | null>(null);

  // Persist answers to localStorage for reconnect
  useEffect(() => {
    if (answers.length > 0) {
      localStorage.setItem(
        STATE_KEY + "_" + caseId,
        JSON.stringify({ answers, currentIndex, phase }),
      );
    }
  }, [answers, currentIndex, phase, caseId]);

  // Restore from localStorage on mount
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const saved = localStorage.getItem(STATE_KEY + "_" + caseId);
      if (!saved) return;

      try {
        const parsed: unknown = JSON.parse(saved);
        if (!isRecord(parsed)) return;

        const restored = parsed;
        if (
          Array.isArray(restored.answers) &&
          restored.answers.every(isAnswerRecord)
        ) {
          setAnswers(restored.answers);
        }
        if (
          typeof restored.currentIndex === "number" &&
          Number.isInteger(restored.currentIndex) &&
          restored.currentIndex >= 0 &&
          restored.currentIndex < MOCK_QUESTIONS.length
        ) {
          setCurrentIndex(restored.currentIndex);
        }
      } catch {
        // Ignore malformed saved state and start with a fresh quiz.
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [caseId]);

  // Timer countdown during question phase
  useEffect(() => {
    if (phase !== "question") return;
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setPhase("results");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [phase]);

  const startQuiz = useCallback(() => {
    setPhase("question");
    setCurrentIndex(0);
    setTimeRemaining(45 * 60);
    setIsLocked(false);
  }, []);

  const submitAnswer = useCallback(
    async (option: string) => {
      if (isLocked) return;
      setIsLocked(true);
      setPendingAnswer(option);

      const record: AnswerRecord = {
        questionId: MOCK_QUESTIONS[currentIndex]?.id ?? "",
        selectedOption: option,
        submittedAt: new Date().toISOString(),
        correct: option === MOCK_QUESTIONS[currentIndex]?.options?.[0], // mock: first option is always correct
        pointsEarned:
          option === MOCK_QUESTIONS[currentIndex]?.options?.[0]
            ? MOCK_QUESTIONS[currentIndex].points
            : 0,
      };

      // Simulate server round-trip delay
      await new Promise((r) => setTimeout(r, 800));
      setAnswers((prev) => [...prev, record]);
      setPendingAnswer(null);

      // Advance or finish
      setTimeout(() => {
        setIsLocked(false);
        if (currentIndex >= MOCK_QUESTIONS.length - 1) {
          setPhase("results");
        } else {
          setPhase("transitioning");
          setTimeout(() => {
            setCurrentIndex((i) => i + 1);
            setPhase("question");
          }, 600);
        }
      }, 1000);
    },
    [isLocked, currentIndex],
  );

  const markTeamReady = useCallback(() => setTeamReady(true), []);

  return {
    phase,
    questions: MOCK_QUESTIONS,
    currentIndex,
    currentQuestion: MOCK_QUESTIONS[currentIndex] ?? null,
    answers,
    isOnline,
    isLocked,
    timeRemaining,
    totalSeconds: 45 * 60,
    teamReady,
    pendingAnswer,
    startQuiz,
    submitAnswer,
    markTeamReady,
  };
}
