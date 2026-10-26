"use client";
import { useState, useCallback, useEffect, useRef } from "react";
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

export function useQuizState(caseId: string) {
  const [phase, setPhase] = useState<QuizPhase>("lobby");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(45 * 60);
  const [teamReady, setTeamReady] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [pendingAnswer, setPendingAnswer] = useState<string | null>(null);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOnline(navigator.onLine);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Persist answers to localStorage for reconnect
  useEffect(() => {
    if (answers.length > 0) {
      localStorage.setItem(STATE_KEY + "_" + caseId, JSON.stringify({ answers, currentIndex, phase }));
    }
  }, [answers, currentIndex, phase, caseId]);

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STATE_KEY + "_" + caseId);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.currentIndex) setCurrentIndex(parsed.currentIndex);
      } catch { /* ignore malformed */ }
    }
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

  const submitAnswer = useCallback(async (option: string) => {
    if (isLocked) return;
    setIsLocked(true);
    setPendingAnswer(option);

    const record: AnswerRecord = {
      questionId: MOCK_QUESTIONS[currentIndex]?.id ?? "",
      selectedOption: option,
      submittedAt: new Date().toISOString(),
      correct: option === MOCK_QUESTIONS[currentIndex]?.options?.[0], // mock: first option is always correct
      pointsEarned: option === MOCK_QUESTIONS[currentIndex]?.options?.[0] ? MOCK_QUESTIONS[currentIndex].points : 0,
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
  }, [isLocked, currentIndex]);

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
