"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-auth";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Clock3,
  FileText,
  Radio,
  Wifi,
  WifiOff,
} from "lucide-react";
import { getEventSnapshot, quizQuestions, submitQuizAnswer } from "@/api/event";
import type {
  AnswerResult,
  EventInfo,
  QuizProgress,
} from "@/types/event.types";
import type { DetectiveAgency } from "@/types/team.types";
import { BrassButton } from "@/components/theme/brass-button";

const DRAFT_KEY = "eleczza.quiz-answer-draft.v1";

interface AnswerDraft {
  questionId: string;
  optionIndex: number;
  submitted: boolean;
  submissionId?: string;
}

function subscribeToNetwork(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

function getNetworkSnapshot() {
  return navigator.onLine;
}

function getServerNetworkSnapshot() {
  return true;
}

function readDraft(): AnswerDraft | null {
  const raw = window.localStorage.getItem(DRAFT_KEY);
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (
      typeof value === "object" &&
      value !== null &&
      "questionId" in value &&
      "optionIndex" in value &&
      "submitted" in value &&
      typeof value.questionId === "string" &&
      typeof value.optionIndex === "number" &&
      typeof value.submitted === "boolean"
    ) {
      const submissionId =
        "submissionId" in value && typeof value.submissionId === "string"
          ? value.submissionId
          : undefined;
      if (value.submitted && !submissionId) {
        window.localStorage.removeItem(DRAFT_KEY);
        return null;
      }
      return {
        questionId: value.questionId,
        optionIndex: value.optionIndex,
        submitted: value.submitted,
        submissionId,
      };
    }
  } catch {
    window.localStorage.removeItem(DRAFT_KEY);
    return null;
  }
  window.localStorage.removeItem(DRAFT_KEY);
  return null;
}

export default function QuizPage() {
  const router = useRouter();
  const { user } = useUser();
  const [agency, setAgency] = useState<DetectiveAgency | null>(null);
  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null);
  const [progress, setProgress] = useState<QuizProgress | null>(null);
  const [readyTeams, setReadyTeams] = useState<{
    ready: number;
    total: number;
  } | null>(null);
  const [draft, setDraft] = useState<AnswerDraft | null>(null);
  const [remaining, setRemaining] = useState(0);
  const online = useSyncExternalStore(
    subscribeToNetwork,
    getNetworkSnapshot,
    getServerNetworkSnapshot,
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{
    question: (typeof quizQuestions)[number];
    result: AnswerResult;
  } | null>(null);
  const isSubmittingRef = useRef(false);

  const load = useCallback(async () => {
    try {
      const snapshot = await getEventSnapshot(user?.id);
      setAgency(snapshot.agency);
      setEventInfo(snapshot.event);
      setProgress(snapshot.progress);
      setReadyTeams({ ready: snapshot.readyTeams, total: snapshot.totalTeams });
      const savedDraft = readDraft();
      const draftQuestionIndex = savedDraft
        ? quizQuestions.findIndex(
            (question) => question.id === savedDraft.questionId,
          )
        : -1;
      const wasRecorded =
        savedDraft &&
        (snapshot.progress.answers[savedDraft.questionId] ===
          savedDraft.optionIndex ||
          (draftQuestionIndex >= 0 &&
            snapshot.progress.questionIndex > draftQuestionIndex));
      if (wasRecorded) {
        window.localStorage.removeItem(DRAFT_KEY);
        setDraft(null);
      } else {
        setDraft(savedDraft);
      }
      setError(null);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to restore the investigation.",
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  useEffect(() => {
    if (progress?.status !== "LOBBY") return;
    const refreshLobby = () => {
      void getEventSnapshot(user?.id)
        .then((snapshot) => {
          setAgency(snapshot.agency);
          setEventInfo(snapshot.event);
          setProgress(snapshot.progress);
          setReadyTeams({
            ready: snapshot.readyTeams,
            total: snapshot.totalTeams,
          });
          setError(null);
        })
        .catch((refreshError: unknown) => {
          setError(
            refreshError instanceof Error
              ? refreshError.message
              : "Unable to refresh bureau readiness.",
          );
        });
    };
    const interval = window.setInterval(refreshLobby, 5000);
    window.addEventListener("eleczza:event-updated", refreshLobby);
    window.addEventListener("storage", refreshLobby);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("eleczza:event-updated", refreshLobby);
      window.removeEventListener("storage", refreshLobby);
    };
  }, [progress?.status, user?.id]);

  const question =
    progress?.status === "IN_PROGRESS"
      ? quizQuestions[progress.questionIndex]
      : undefined;
  const deadline =
    progress?.questionStartedAt && question
      ? new Date(progress.questionStartedAt).getTime() +
        question.durationSeconds * 1000
      : null;

  useEffect(() => {
    if (!question || !deadline) return;
    const update = () =>
      setRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    const interval = window.setInterval(update, 250);
    return () => window.clearInterval(interval);
  }, [question, deadline]);

  const selectedOption =
    draft && question && draft.questionId === question.id
      ? draft.optionIndex
      : null;

  const sendAnswer = useCallback(
    async (
      optionIndex: number,
      questionId: string,
      existingSubmissionId?: string,
    ) => {
      if (isSubmittingRef.current) return;
      isSubmittingRef.current = true;
      setSubmitting(true);
      setError(null);
      const savedDraft = readDraft();
      const submissionId =
        existingSubmissionId ??
        (savedDraft?.submitted &&
        savedDraft.questionId === questionId &&
        savedDraft.optionIndex === optionIndex
          ? savedDraft.submissionId
          : undefined) ??
        crypto.randomUUID();
      const submittedDraft = {
        questionId,
        optionIndex,
        submissionId,
        submitted: true,
      };
      try {
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(submittedDraft));
        setDraft(submittedDraft);
        const activeQuestion = quizQuestions.find(
          (item) => item.id === questionId,
        );
        if (!activeQuestion)
          throw new Error("The selected question is no longer available.");
        const result = await submitQuizAnswer({
          questionId,
          optionIndex,
          submissionId,
        });
        window.localStorage.removeItem(DRAFT_KEY);
        setDraft(null);
        setProgress(result.progress);
        setConfirmation({ question: activeQuestion, result });
      } catch (submitError) {
        setError(
          navigator.onLine
            ? submitError instanceof Error
              ? submitError.message
              : "The answer could not be filed. Your selection is saved on this device."
            : "You are offline. Your answer is saved on this device and will sync when you reconnect.",
        );
      } finally {
        isSubmittingRef.current = false;
        setSubmitting(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (
      online &&
      question &&
      draft?.submitted &&
      draft.questionId === question.id &&
      !isSubmittingRef.current
    ) {
      void Promise.resolve().then(() =>
        sendAnswer(draft.optionIndex, draft.questionId, draft.submissionId),
      );
    }
  }, [
    online,
    question,
    draft?.questionId,
    draft?.optionIndex,
    draft?.submitted,
    draft?.submissionId,
    sendAnswer,
  ]);

  const chooseOption = (index: number) => {
    if (!question) return;
    const answerDraft = {
      questionId: question.id,
      optionIndex: index,
      submitted: false,
    };
    setDraft(answerDraft);
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(answerDraft));
  };

  const continueAfterAnswer = () => {
    setConfirmation(null);
    if (progress?.status === "COMPLETED") {
      router.push("/results");
      return;
    }
    setError(null);
  };

  if (loading) {
    return (
      <p className="text-sm text-[#D9CEB8]" role="status">
        Restoring your case file…
      </p>
    );
  }
  if (!eventInfo || !progress) {
    return (
      <div className="space-y-4 rounded-lg border border-[#2D3344] bg-[#12151C] p-6">
        <p className="text-sm text-[#F7B7B7]" role="alert">
          {error ?? "The investigation could not be restored."}
        </p>
        <button
          type="button"
          onClick={() => void load()}
          className="text-sm text-[#DFB75A] underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!agency) {
    return (
      <section className="parchment-border mx-auto max-w-2xl rounded-lg bg-[#12151C] p-8 text-center">
        <FileText className="mx-auto h-9 w-9 text-[#DFB75A]" />
        <h1 className="mt-4 text-2xl font-bold text-[#F7F2E7]">
          No agency on file
        </h1>
        <p className="mt-2 text-sm text-[#D9CEB8]">
          Charter an agency or enlist with a passcode before reporting to the
          bureau.
        </p>
        <Link
          href="/team"
          className="mt-5 inline-flex text-sm font-semibold text-[#DFB75A] hover:underline"
        >
          Organize your team <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </section>
    );
  }

  const allReady =
    agency.members.length > 0 &&
    agency.members.every((member) => member.isReady);
  if (progress.status === "COMPLETED") {
    return (
      <section className="parchment-border mx-auto max-w-2xl rounded-lg bg-[#12151C] p-8 text-center">
        <Check className="mx-auto h-10 w-10 text-[#3EAA75]" />
        <p className="mt-4 text-xs font-semibold tracking-widest text-[#DFB75A] uppercase">
          Investigation complete
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[#F7F2E7]">
          Your report is with the bureau.
        </h1>
        <p className="mt-2 text-sm text-[#D9CEB8]">
          {progress.score} points · {progress.correctCount} of{" "}
          {quizQuestions.length} deductions verified
        </p>
        <Link
          href="/results"
          className="mt-5 inline-flex text-sm font-semibold text-[#DFB75A] hover:underline"
        >
          Review case results <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </section>
    );
  }

  if (progress.status === "LOBBY") {
    const isLeader = agency.leaderId === user?.id;
    return (
      <section className="parchment-border mx-auto max-w-3xl rounded-lg bg-[#12151C] p-8 text-center">
        <div className="animate-[signal-pulse_2.4s_ease-in-out_infinite] motion-reduce:animate-none mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#DFB75A]/40 bg-[#DFB75A]/10">
          <Radio className="h-7 w-7 text-[#DFB75A]" />
        </div>
        <p className="mt-5 text-xs font-semibold tracking-widest text-[#DFB75A] uppercase">
          Bureau dispatch
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[#F7F2E7]">
          Waiting for the detective bureau…
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-[#D9CEB8]">
          The case briefing will open when every agency member is ready. You can
          keep this page open; your roster and progress are restored when you
          reconnect.
        </p>
        <p
          className={`mt-3 inline-flex items-center gap-2 text-xs ${online ? "text-[#3EAA75]" : "text-[#F7B7B7]"}`}
          aria-live="polite"
        >
          {online ? (
            <Wifi className="h-4 w-4" />
          ) : (
            <WifiOff className="h-4 w-4" />
          )}
          {online
            ? "Connected to bureau dispatch"
            : "Offline · waiting to reconnect"}
        </p>
        {error && (
          <p
            role="alert"
            className="mx-auto mt-4 max-w-md rounded border border-[#9E2A2B]/50 bg-[#9E2A2B]/10 p-3 text-xs text-[#F7B7B7]"
          >
            {error}
          </p>
        )}
        <div className="mx-auto mt-6 max-w-md rounded border border-[#2D3344] bg-[#0B0C10] p-4 text-left">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#D9CEB8]">Your agency · {agency.name}</span>
            <span className={allReady ? "text-[#3EAA75]" : "text-[#DFB75A]"}>
              {allReady ? "All members ready" : "Readiness pending"}
            </span>
          </div>
          <div
            className="mt-3 h-2 overflow-hidden rounded-full bg-[#2D3344]"
            role="progressbar"
            aria-label="Agency readiness"
            aria-valuemin={0}
            aria-valuemax={agency.members.length}
            aria-valuenow={
              agency.members.filter((member) => member.isReady).length
            }
          >
            <div
              className="h-full rounded-full bg-[#DFB75A] transition-[width] duration-500 motion-reduce:transition-none"
              style={{
                width: `${(agency.members.filter((member) => member.isReady).length / agency.members.length) * 100}%`,
              }}
            />
          </div>
          <p className="mt-2 text-[11px] text-[#8892B0]">
            {agency.members.filter((member) => member.isReady).length} of{" "}
            {agency.members.length} agency members ready
          </p>
          <p className="mt-2 border-t border-[#2D3344] pt-2 text-[11px] text-[#8892B0]">
            Bureau readiness · {readyTeams?.ready ?? 0} of{" "}
            {readyTeams?.total ?? 0} agencies ready
          </p>
        </div>
        {isLeader && (
          <p className="mt-4 text-xs text-[#8892B0]">
            Lead Inspectors can open the briefing from the{" "}
            <Link href="/team" className="text-[#DFB75A] underline">
              agency roster
            </Link>{" "}
            once all members are ready.
          </p>
        )}
      </section>
    );
  }

  if (!question) {
    return (
      <p role="alert" className="text-sm text-[#F7B7B7]">
        No active question was returned by the bureau.
      </p>
    );
  }

  const circumference = 2 * Math.PI * 25;
  const progressRatio = remaining / question.durationSeconds;

  return (
    <div data-quiz-screen className="quiz-screen space-y-4">
      <div className="flex flex-col gap-4 border-b border-[#2D3344] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-semibold tracking-wider text-[#DFB75A] uppercase">
            Active Investigation · Question {question.order} of{" "}
            {quizQuestions.length}
          </span>
          <h1 className="mt-1 text-xl font-bold text-[#F7F2E7]">
            {eventInfo.name}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div
            aria-live="polite"
            className={`flex items-center gap-2 text-xs ${online ? "text-[#3EAA75]" : "text-[#F7B7B7]"}`}
          >
            {online ? (
              <Wifi className="h-4 w-4" />
            ) : (
              <WifiOff className="h-4 w-4" />
            )}
            {online ? "Connected" : "Offline"}
          </div>
          <div
            className="relative flex h-16 w-16 items-center justify-center"
            aria-label={`${remaining} seconds remaining`}
          >
            <svg
              className="-rotate-90"
              viewBox="0 0 60 60"
              role="img"
              aria-hidden="true"
            >
              <circle
                cx="30"
                cy="30"
                r="25"
                fill="none"
                stroke="#2D3344"
                strokeWidth="4"
              />
              <circle
                cx="30"
                cy="30"
                r="25"
                fill="none"
                stroke={remaining <= 10 ? "#9E2A2B" : "#DFB75A"}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progressRatio)}
                className="transition-[stroke-dashoffset] duration-200 motion-reduce:transition-none"
              />
            </svg>
            <span className="absolute flex items-center gap-1 font-mono text-sm text-[#F7F2E7]">
              <Clock3 className="h-3.5 w-3.5 text-[#DFB75A]" />
              {remaining}
            </span>
          </div>
        </div>
      </div>

      <div
        className="flex items-center gap-2"
        aria-label={`Question ${question.order} of ${quizQuestions.length}`}
      >
        {quizQuestions.map((item, index) => (
          <div
            key={item.id}
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#2D3344]"
          >
            <div
              className="h-full bg-[#DFB75A] transition-[width] duration-300 motion-reduce:transition-none"
              style={{
                width:
                  index < progress.questionIndex
                    ? "100%"
                    : index === progress.questionIndex
                      ? "35%"
                      : "0%",
              }}
            />
          </div>
        ))}
        <span className="ml-2 text-[11px] text-[#D9CEB8]">
          {progress.score} pts
        </span>
      </div>

      <div className="grid gap-4">
        <section className="parchment-border rounded-lg bg-[#12151C] p-4 sm:p-5">
          <div className="flex items-center gap-2 border-b border-[#2D3344] pb-4">
            <FileText className="h-4 w-4 text-[#DFB75A]" />
            <span className="text-xs font-semibold tracking-widest text-[#DFB75A] uppercase">
              Case evidence · {question.points} points
            </span>
          </div>
          <h2 className="mt-3 text-base font-bold leading-relaxed text-[#F7F2E7] sm:text-lg">
            {question.prompt}
          </h2>
          <fieldset
            className="mt-3 space-y-2"
            disabled={remaining === 0 || submitting || Boolean(confirmation)}
          >
            <legend className="mb-3 text-xs font-semibold tracking-wider text-[#D9CEB8] uppercase">
              Select one deduction
            </legend>
            {question.options.map((option, index) => (
              <label
                key={option}
                className={`flex cursor-pointer items-start gap-3 rounded border px-3 py-2.5 text-sm transition-colors focus-within:border-[#F3D88C] focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-[#F3D88C] ${
                  selectedOption === index
                    ? "border-[#DFB75A] bg-[#DFB75A]/10 text-[#F7F2E7]"
                    : "border-[#2D3344] bg-[#0B0C10] text-[#D9CEB8] hover:border-[#DFB75A]/50"
                }`}
              >
                <input
                  type="radio"
                  name="deduction"
                  value={index}
                  checked={selectedOption === index}
                  onChange={() => chooseOption(index)}
                  className="mt-0.5 accent-[#DFB75A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DFB75A]"
                />
                <span className="font-mono text-[#DFB75A]">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span>{option}</span>
              </label>
            ))}
          </fieldset>
          {remaining === 0 && (
            <p
              className="mt-4 flex items-center gap-2 text-xs text-[#F7B7B7]"
              role="alert"
            >
              <AlertTriangle className="h-4 w-4" />
              Time expired. File the selected answer or advance without an
              answer.
            </p>
          )}
          {error && (
            <p
              className="mt-4 rounded border border-[#9E2A2B]/50 bg-[#9E2A2B]/10 p-3 text-xs text-[#F7B7B7]"
              role="alert"
            >
              {error}
              {draft?.submitted && (
                <span className="mt-1 block text-[#D9CEB8]">
                  The draft remains saved on this device.
                </span>
              )}
            </p>
          )}
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-[#8892B0]">
              Your selection is saved locally until it is filed.
            </span>
            <BrassButton
              type="button"
              disabled={
                submitting || (remaining > 0 && selectedOption === null)
              }
              onClick={() =>
                void sendAnswer(
                  selectedOption ?? -1,
                  question.id,
                  draft?.submitted && draft.questionId === question.id
                    ? draft.submissionId
                    : undefined,
                )
              }
              withLoupe
            >
              {submitting
                ? "Filing evidence…"
                : draft?.submitted
                  ? "Retry answer sync"
                  : "Lock in answer"}
            </BrassButton>
          </div>
        </section>
      </div>

      {confirmation && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="answer-confirmation-title"
        >
          <section className="motion-safe:animate-[fade-up_200ms_ease-out] parchment-border w-full max-w-md rounded-lg bg-[#12151C] p-6 text-center shadow-2xl">
            <div
              className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${confirmation.result.correct ? "bg-[#2A7B54]/15 text-[#3EAA75]" : "bg-[#9E2A2B]/15 text-[#F7B7B7]"}`}
            >
              {confirmation.result.correct ? (
                <Check className="h-6 w-6" />
              ) : (
                <AlertTriangle className="h-6 w-6" />
              )}
            </div>
            <h2
              id="answer-confirmation-title"
              className="mt-4 text-xl font-bold text-[#F7F2E7]"
            >
              Answer filed with the bureau
            </h2>
            <p className="mt-2 text-sm text-[#D9CEB8]">
              {confirmation.result.correct
                ? `Deduction verified. ${confirmation.result.awardedPoints} points awarded.`
                : "The evidence does not support this deduction. Your answer is locked."}
            </p>
            <p className="mt-2 font-mono text-xs text-[#DFB75A]">
              Agency score · {confirmation.result.score} points
            </p>
            <BrassButton
              type="button"
              className="mt-6"
              onClick={continueAfterAnswer}
            >
              {confirmation.result.progress.status === "COMPLETED"
                ? "View case results"
                : "Continue investigation"}
              <ArrowRight className="h-4 w-4" />
            </BrassButton>
          </section>
        </div>
      )}
    </div>
  );
}
