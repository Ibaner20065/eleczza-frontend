import { apiRequest } from "@/api/client";
import type { DetectiveAgency, TeamMember } from "@/types/team.types";
import type {
  AnswerResult,
  AnswerSubmission,
  EventInfo,
  EventSnapshot,
  LeaderboardEntry,
  QuizProgress,
  QuizQuestion,
} from "@/types/event.types";
import type { CreateTeamInput, JoinTeamInput } from "@/lib/validators/team";
import { z } from "zod";

const MOCK_STORAGE_KEY = "eleczza.event-demo.v1";
const MOCK_TEAM_CODE = "BSK221";
const TEAM_CACHE_PREFIX = "eleczza.team-cache.";
const EVENT_CACHE_PREFIX = "eleczza.event-cache.";
const READINESS_QUEUE_PREFIX = "eleczza.team-readiness.";
const PASSCODE_CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function createMockPasscode() {
  const randomBytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(randomBytes, (byte) =>
    PASSCODE_CHARACTERS.charAt(byte % PASSCODE_CHARACTERS.length),
  ).join("");
}

const event: EventInfo = {
  id: "case-zero",
  name: "Case Zero: The Signal in Room 304",
  description:
    "Decode the midnight transmission, identify its source, and file your findings before the trail goes cold.",
  startsAt: "2026-10-25T03:00:00.000Z",
  endsAt: "2026-10-25T11:00:00.000Z",
  status: "LIVE",
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: "signal-origin",
    order: 1,
    prompt:
      "The transmission reads AOT221B after decoding. Which department initiated the relay?",
    options: [
      "Computer Science",
      "Electrical Engineering",
      "Chemistry",
      "Physics",
    ],
    points: 100,
    durationSeconds: 45,
  },
  {
    id: "cipher-method",
    order: 2,
    prompt:
      "The field note says ROT-13. What does this cipher do to each letter?",
    options: [
      "Moves it thirteen places through the alphabet",
      "Reverses the complete message",
      "Replaces every letter with its number",
      "Moves each letter one place forward",
    ],
    points: 150,
    durationSeconds: 45,
  },
  {
    id: "evidence-time",
    order: 3,
    prompt: "At what time did the irregular signal first appear?",
    options: ["22:14", "23:42", "00:30", "01:15"],
    points: 150,
    durationSeconds: 45,
  },
];

const correctAnswers = [0, 0, 1];

interface MockState {
  agency: DetectiveAgency | null;
  progress: QuizProgress;
  submissions: Record<string, AnswerResult>;
}

const progressSchema = z.object({
  status: z.enum(["LOBBY", "IN_PROGRESS", "COMPLETED"]),
  questionIndex: z.number().int().nonnegative(),
  questionStartedAt: z.string().nullable(),
  answers: z.record(z.string(), z.number()),
  score: z.number(),
  correctCount: z.number().int().nonnegative(),
  completedAt: z.string().nullable(),
});

const answerResultSchema = z.object({
  correct: z.boolean(),
  awardedPoints: z.number(),
  score: z.number(),
  correctCount: z.number().int().nonnegative(),
  progress: progressSchema,
});

const agencySchema = z.object({
  id: z.string(),
  name: z.string(),
  motto: z.string().nullable().optional(),
  passcode: z.string(),
  leaderId: z.string(),
  members: z.array(
    z.object({
      userId: z.string(),
      fullName: z.string(),
      email: z.string(),
      role: z.enum(["LEAD_INSPECTOR", "CRYPTANALYST", "FIELD_AGENT"]),
      isReady: z.boolean(),
    }),
  ),
  score: z.number(),
  rank: z.number().optional(),
  createdAt: z.string(),
});

const mockStateSchema = z.object({
  agency: agencySchema.nullable(),
  progress: progressSchema,
  submissions: z.record(z.string(), answerResultSchema),
});

const eventSnapshotSchema = z.object({
  event: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    startsAt: z.string(),
    endsAt: z.string(),
    status: z.enum(["UPCOMING", "LIVE", "COMPLETED"]),
  }),
  agency: agencySchema.nullable(),
  readyTeams: z.number().int().nonnegative(),
  totalTeams: z.number().int().nonnegative(),
  progress: progressSchema,
});

const initialProgress = (): QuizProgress => ({
  status: "LOBBY",
  questionIndex: 0,
  questionStartedAt: null,
  answers: {},
  score: 0,
  correctCount: 0,
  completedAt: null,
});

function readMockState(): MockState {
  const value = window.localStorage.getItem(MOCK_STORAGE_KEY);
  if (!value) {
    return { agency: null, progress: initialProgress(), submissions: {} };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error(
      "Saved demo progress is unreadable. Reset browser storage to continue.",
    );
  }
  const result = mockStateSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      "Saved demo progress is invalid. Reset browser storage to continue.",
    );
  }
  return result.data;
}

function saveMockState(state: MockState) {
  window.localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event("eleczza:event-updated"));
}

function teamCacheKey(userId: string) {
  return `${TEAM_CACHE_PREFIX}${encodeURIComponent(userId)}`;
}

function readinessQueueKey(userId: string) {
  return `${READINESS_QUEUE_PREFIX}${encodeURIComponent(userId)}`;
}

function eventCacheKey(userId: string) {
  return `${EVENT_CACHE_PREFIX}${encodeURIComponent(userId)}`;
}

function readCachedSnapshot(userId: string) {
  const raw = window.localStorage.getItem(eventCacheKey(userId));
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Saved event records are unreadable.");
  }
  const result = eventSnapshotSchema.safeParse(parsed);
  if (!result.success) throw new Error("Saved event records are invalid.");
  return result.data;
}

function readCachedAgency(userId: string) {
  const raw = window.localStorage.getItem(teamCacheKey(userId));
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Saved agency records are unreadable.");
  }
  const result = agencySchema.safeParse(parsed);
  if (!result.success) throw new Error("Saved agency records are invalid.");
  return result.data;
}

function cacheAgency(userId: string, agency: DetectiveAgency | null) {
  const key = teamCacheKey(userId);
  if (agency) window.localStorage.setItem(key, JSON.stringify(agency));
  else window.localStorage.removeItem(key);
}

function cacheQueuedReadiness(userId: string, isReady: boolean) {
  const agency = readCachedAgency(userId);
  if (!agency) {
    throw new Error(
      "Agency data is not available offline. Reconnect and try again.",
    );
  }
  const updatedAgency = {
    ...agency,
    members: agency.members.map((member) =>
      member.userId === userId ? { ...member, isReady } : member,
    ),
  };
  cacheAgency(userId, updatedAgency);
  const snapshot = readCachedSnapshot(userId);
  if (snapshot) {
    window.localStorage.setItem(
      eventCacheKey(userId),
      JSON.stringify({ ...snapshot, agency: updatedAgency }),
    );
  }
  window.localStorage.setItem(readinessQueueKey(userId), String(isReady));
  return updatedAgency;
}

async function request<T>(
  endpoint: string,
  options?: RequestInit,
  mockResponse?: T,
): Promise<T> {
  const response = await apiRequest<T>(endpoint, options, mockResponse);
  if (response.error || response.data === null) {
    throw new Error(response.error ?? "The event service returned no data.");
  }
  return response.data;
}

export async function getEventSnapshot(
  userId?: string,
): Promise<EventSnapshot> {
  if (process.env.NEXT_PUBLIC_MOCK_API === "true") {
    const state = readMockState();
    return {
      event,
      agency: state.agency,
      readyTeams: state.agency?.members.every((member) => member.isReady)
        ? 4
        : 3,
      totalTeams: 5,
      progress: state.progress,
    };
  }
  try {
    const [eventInfo, agency, progress, readiness] = await Promise.all([
      getEventInfo(),
      getAgencyRoster(userId),
      getQuizProgress(),
      request<{ readyTeams: number; totalTeams: number }>(
        "/events/active/readiness",
      ),
    ]);
    const snapshot = { event: eventInfo, agency, progress, ...readiness };
    if (userId) {
      window.localStorage.setItem(
        eventCacheKey(userId),
        JSON.stringify(snapshot),
      );
    }
    return snapshot;
  } catch (error) {
    if (userId && !navigator.onLine) {
      const cachedSnapshot = readCachedSnapshot(userId);
      if (cachedSnapshot) return cachedSnapshot;
    }
    throw error;
  }
}

export async function getEventInfo(): Promise<EventInfo> {
  if (process.env.NEXT_PUBLIC_MOCK_API === "true") return event;
  return request<EventInfo>("/events/active");
}

export async function getQuizProgress(): Promise<QuizProgress> {
  if (process.env.NEXT_PUBLIC_MOCK_API === "true") {
    return readMockState().progress;
  }
  return request<QuizProgress>("/quiz/session");
}

export async function createAgency(
  input: CreateTeamInput,
  member: Pick<TeamMember, "userId" | "fullName" | "email">,
): Promise<DetectiveAgency> {
  if (process.env.NEXT_PUBLIC_MOCK_API === "true") {
    const state = readMockState();
    if (state.agency) throw new Error("You already belong to an agency.");
    const agency: DetectiveAgency = {
      id: crypto.randomUUID(),
      name: input.name,
      motto: input.motto,
      passcode: createMockPasscode(),
      leaderId: member.userId,
      members: [
        {
          ...member,
          role: "LEAD_INSPECTOR",
          isReady: false,
        },
      ],
      score: 0,
      createdAt: new Date().toISOString(),
    };
    state.agency = agency;
    saveMockState(state);
    return agency;
  }
  const agency = await request<DetectiveAgency>("/teams", {
    method: "POST",
    body: JSON.stringify(input),
  });
  cacheAgency(member.userId, agency);
  return agency;
}

export async function joinAgency(
  input: JoinTeamInput,
  member: Pick<TeamMember, "userId" | "fullName" | "email">,
): Promise<DetectiveAgency> {
  if (process.env.NEXT_PUBLIC_MOCK_API === "true") {
    const state = readMockState();
    if (state.agency) throw new Error("You already belong to an agency.");
    if (input.passcode !== MOCK_TEAM_CODE) {
      throw new Error("No agency was found for that passcode.");
    }
    const agency: DetectiveAgency = {
      id: "demo-baskerville-agency",
      name: "The Baskerville Syndicate",
      motto: "Trust the evidence.",
      passcode: MOCK_TEAM_CODE,
      leaderId: "demo-lead-inspector",
      members: [
        {
          userId: "demo-lead-inspector",
          fullName: "Sherlock Holmes",
          email: "s.holmes@aot.edu.in",
          role: "LEAD_INSPECTOR",
          isReady: true,
        },
        { ...member, role: "FIELD_AGENT", isReady: false },
      ],
      score: 0,
      createdAt: new Date().toISOString(),
    };
    state.agency = agency;
    saveMockState(state);
    return agency;
  }
  const agency = await request<DetectiveAgency>("/teams/join", {
    method: "POST",
    body: JSON.stringify(input),
  });
  cacheAgency(member.userId, agency);
  return agency;
}

export async function getAgencyRoster(
  userId?: string,
): Promise<DetectiveAgency | null> {
  if (process.env.NEXT_PUBLIC_MOCK_API === "true") {
    return readMockState().agency;
  }
  const response = await apiRequest<DetectiveAgency | null>("/teams/me");
  if (response.error) {
    if (userId && !navigator.onLine && response.status === 0) {
      const cachedAgency = readCachedAgency(userId);
      if (cachedAgency) return cachedAgency;
    }
    throw new Error(response.error);
  }
  if (userId) cacheAgency(userId, response.data);
  return response.data;
}

export async function setAgencyMemberReady(
  userId: string,
  isReady: boolean,
): Promise<DetectiveAgency> {
  if (process.env.NEXT_PUBLIC_MOCK_API === "true") {
    const state = readMockState();
    if (!state.agency) throw new Error("Join an agency before marking ready.");
    const member = state.agency.members.find(
      (entry) => entry.userId === userId,
    );
    if (!member) throw new Error("Your agency membership could not be found.");
    member.isReady = isReady;
    saveMockState(state);
    return state.agency;
  }
  if (!navigator.onLine) return cacheQueuedReadiness(userId, isReady);
  const response = await apiRequest<DetectiveAgency>("/teams/me/ready", {
    method: "PATCH",
    body: JSON.stringify({ isReady }),
  });
  if (response.error || response.data === null) {
    if (response.status === 0 && !navigator.onLine) {
      return cacheQueuedReadiness(userId, isReady);
    }
    throw new Error(response.error ?? "The agency service returned no data.");
  }
  cacheAgency(userId, response.data);
  window.localStorage.removeItem(readinessQueueKey(userId));
  return response.data;
}

export async function syncQueuedAgencyReadiness(
  userId: string,
): Promise<DetectiveAgency | null> {
  if (process.env.NEXT_PUBLIC_MOCK_API === "true" || !navigator.onLine) {
    return null;
  }
  const queuedValue = window.localStorage.getItem(readinessQueueKey(userId));
  if (queuedValue === null) return null;
  if (queuedValue !== "true" && queuedValue !== "false") {
    throw new Error("The saved readiness update is invalid.");
  }
  const response = await apiRequest<DetectiveAgency>("/teams/me/ready", {
    method: "PATCH",
    body: JSON.stringify({ isReady: queuedValue === "true" }),
  });
  if (response.error || response.data === null) {
    throw new Error(response.error ?? "The agency service returned no data.");
  }
  cacheAgency(userId, response.data);
  window.localStorage.removeItem(readinessQueueKey(userId));
  return response.data;
}

export async function startQuiz(userId: string): Promise<QuizProgress> {
  if (process.env.NEXT_PUBLIC_MOCK_API === "true") {
    const state = readMockState();
    if (!state.agency)
      throw new Error("Create or join an agency before the briefing.");
    if (state.agency.leaderId !== userId) {
      throw new Error("Only the Lead Inspector can open the briefing.");
    }
    if (state.progress.status !== "LOBBY") {
      throw new Error("The investigation has already started.");
    }
    if (!state.agency.members.every((member) => member.isReady)) {
      throw new Error("Every agency member must be ready before the briefing.");
    }
    state.progress = {
      ...initialProgress(),
      status: "IN_PROGRESS",
      questionStartedAt: new Date().toISOString(),
    };
    saveMockState(state);
    return state.progress;
  }
  return request<QuizProgress>("/quiz/session/start", { method: "POST" });
}

export async function submitQuizAnswer(
  answer: AnswerSubmission,
): Promise<AnswerResult> {
  if (process.env.NEXT_PUBLIC_MOCK_API === "true") {
    const state = readMockState();
    const previousSubmission = state.submissions[answer.submissionId];
    if (previousSubmission) return previousSubmission;
    const question = quizQuestions[state.progress.questionIndex];
    if (state.progress.status !== "IN_PROGRESS" || !question) {
      throw new Error("There is no active question to answer.");
    }
    if (question.id !== answer.questionId) {
      throw new Error("This answer belongs to a different question.");
    }
    const correct =
      correctAnswers[state.progress.questionIndex] === answer.optionIndex;
    const nextIndex = state.progress.questionIndex + 1;
    state.progress = {
      ...state.progress,
      answers: {
        ...state.progress.answers,
        [answer.questionId]: answer.optionIndex,
      },
      score: state.progress.score + (correct ? question.points : 0),
      correctCount: state.progress.correctCount + (correct ? 1 : 0),
      questionIndex: nextIndex,
      status: nextIndex === quizQuestions.length ? "COMPLETED" : "IN_PROGRESS",
      questionStartedAt:
        nextIndex === quizQuestions.length ? null : new Date().toISOString(),
      completedAt:
        nextIndex === quizQuestions.length ? new Date().toISOString() : null,
    };
    if (state.agency) state.agency.score = state.progress.score;
    const result: AnswerResult = {
      correct,
      awardedPoints: correct ? question.points : 0,
      score: state.progress.score,
      correctCount: state.progress.correctCount,
      progress: state.progress,
    };
    state.submissions[answer.submissionId] = result;
    saveMockState(state);
    return result;
  }
  return request<AnswerResult>("/quiz/answers", {
    method: "POST",
    body: JSON.stringify(answer),
  });
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  if (process.env.NEXT_PUBLIC_MOCK_API === "true") {
    const agency = readMockState().agency;
    const entries: LeaderboardEntry[] = [
      {
        teamId: "baker-street",
        teamName: "Baker Street Irregulars",
        leaderName: "S. Holmes",
        score: 420,
        solvedCount: 3,
        rank: 1,
      },
      {
        teamId: "diogenes",
        teamName: "Diogenes Society",
        leaderName: "M. Holmes",
        score: 350,
        solvedCount: 2,
        rank: 2,
      },
      {
        teamId: "norwood",
        teamName: "Norwood Syndicate",
        leaderName: "J. McFarlane",
        score: 250,
        solvedCount: 2,
        rank: 3,
      },
    ];
    if (agency) {
      entries.push({
        teamId: agency.id,
        teamName: agency.name,
        leaderName:
          agency.members.find((member) => member.userId === agency.leaderId)
            ?.fullName ?? "Lead Inspector",
        score: agency.score,
        solvedCount: readMockState().progress.correctCount,
        rank: entries.length + 1,
      });
      entries.sort((a, b) => b.score - a.score);
      entries.forEach((entry, index) => {
        entry.rank = index + 1;
      });
    }
    return entries;
  }
  return request<LeaderboardEntry[]>("/events/leaderboard");
}
