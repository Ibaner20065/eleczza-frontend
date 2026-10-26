// Full mock data for the app — teams, questions, leaderboard, results
import type { CaseFile, Question } from "@/types/quiz.types";
import type { DetectiveAgency, TeamMember } from "@/types/team.types";

// ---- EVENT CONFIG ----
export const MOCK_EVENT = {
  id: "event-221b-2026",
  title: "ELECZZA 2.0 2026: The Final Problem",
  description: "A cryptographic investigation across 10 encrypted dossiers. Seven agencies. One winning deduction.",
  startsAt: "2026-10-26T10:00:00+05:30",
  endsAt: "2026-10-26T13:00:00+05:30",
  venue: "Academy of Technology, Adisaptagram",
  prizePool: "₹15,000",
  totalTeams: 7,
  maxTeamSize: 4,
};

// ---- MOCK QUESTIONS ----
export const MOCK_QUESTIONS: Question[] = [
  {
    id: "q1",
    order: 1,
    title: "The Cipher at the North Wing",
    prompt: "A binary sequence was intercepted on the emergency frequency: 01000001 01001111 01010100. Decode it to find the department abbreviation. What is the decoded text?",
    type: "MULTIPLE_CHOICE",
    options: ["AOT", "BAK", "TAO", "OAT"],
    points: 100,
    penaltyPerAttempt: 20,
    clues: [
      { id: "c1-1", title: "Binary Primer", description: "Each group of 8 bits represents one ASCII character. A=65, O=79, T=84.", isUnlocked: false, costPoints: 25 },
    ],
  },
  {
    id: "q2",
    order: 2,
    title: "The Telegram Cipher",
    prompt: "The encoded telegram reads: GUVF VF GUR NAFJRE. It was encoded using a simple letter substitution. What cipher is this, and what does it say?",
    type: "MULTIPLE_CHOICE",
    options: ["ROT-13: THIS IS THE ANSWER", "ROT-13: THAT WAS THE CLUE", "Caesar +3: CODE IS HERE", "Vigenere: FIND THE KEY"],
    points: 150,
    penaltyPerAttempt: 30,
    clues: [
      { id: "c2-1", title: "Cipher Hint", description: "ROT-13 shifts each letter 13 positions in the alphabet.", isUnlocked: false, costPoints: 40 },
    ],
  },
  {
    id: "q3",
    order: 3,
    title: "The Witness Statement",
    prompt: "Witness account: 'I arrived at 23:42 and left at 00:18. The suspect was there for exactly 36 minutes before me and left 12 minutes after me.' When did the suspect leave?",
    type: "MULTIPLE_CHOICE",
    options: ["00:30", "00:06", "23:06", "01:06"],
    points: 200,
    penaltyPerAttempt: 40,
    clues: [
      { id: "c3-1", title: "Timeline Aid", description: "Draw a timeline. Suspect arrived at 23:42 - 36 = 23:06. Left at 00:18 + 12 = 00:30.", isUnlocked: false, costPoints: 50 },
    ],
  },
  {
    id: "q4",
    order: 4,
    title: "The Spectrographic Anomaly",
    prompt: "The forensic spectrograph returned hash: 5f4dcc3b5aa765d61d8327deb882cf99. This is a well-known hash of a common word. What is the plaintext?",
    type: "MULTIPLE_CHOICE",
    options: ["password", "detective", "sherlock", "221baker"],
    points: 250,
    penaltyPerAttempt: 50,
    clues: [
      { id: "c4-1", title: "Hash Type", description: "This is an MD5 hash. Check common MD5 rainbow tables.", isUnlocked: false, costPoints: 60 },
    ],
  },
  {
    id: "q5",
    order: 5,
    title: "The Final Deduction",
    prompt: "Combining all previous evidence: AOT + ROT13 + 00:30 + password. The first letter of each answer forms a code. What is the 4-letter code?",
    type: "MULTIPLE_CHOICE",
    options: ["ARPP", "ATOP", "ATRO", "AOTP"],
    points: 500,
    penaltyPerAttempt: 100,
    clues: [
      { id: "c5-1", title: "The Final Clue", description: "Take the first character of each of your 4 previous answers in order.", isUnlocked: false, costPoints: 100 },
    ],
  },
];

// ---- MOCK CASE FILE ----
export const MOCK_CASE: CaseFile = {
  id: "case-final-problem-2026",
  slug: "the-final-problem-2026",
  title: "Case #005: The Final Problem",
  briefing: "A cryptographic anomaly has been detected across the Academy of Technology laboratory network. Five interconnected dossiers have been sealed with layered ciphers. Your agency has 45 minutes to pierce all five seals and file your deductions with Scotland Yard.",
  difficulty: "Moriarty",
  durationMinutes: 45,
  startsAt: "2026-10-26T10:00:00+05:30",
  endsAt: "2026-10-26T10:45:00+05:30",
  isLive: true,
  isSolved: false,
  totalPoints: 1200,
  questions: MOCK_QUESTIONS,
};

// ---- MOCK TEAMS ----
export const MOCK_MY_TEAM: DetectiveAgency = {
  id: "team-baker-221",
  name: "The Baker Street Irregulars",
  motto: "Data! Data! Data!",
  passcode: "BSK221",
  leaderId: "user-me",
  members: [
    { userId: "user-me", fullName: "Anushka Choudhury", email: "anushka@aot.edu.in", role: "LEAD_INSPECTOR", isReady: true },
    { userId: "user-2", fullName: "Rahul Sharma", email: "rahul@aot.edu.in", role: "CRYPTANALYST", isReady: true },
    { userId: "user-3", fullName: "Priya Das", email: "priya@aot.edu.in", role: "FIELD_AGENT", isReady: false },
    { userId: "user-4", fullName: "Arjun Mehta", email: "arjun@aot.edu.in", role: "FIELD_AGENT", isReady: true },
  ],
  score: 850,
  rank: 2,
  createdAt: "2026-10-25T09:00:00.000Z",
};

// ---- MOCK LEADERBOARD ----
export interface LeaderboardEntry {
  rank: number;
  teamId: string;
  agencyName: string;
  leadInspector: string;
  score: number;
  solvedCount: number;
  avgSolveMs: number;
  isMyTeam?: boolean;
}

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, teamId: "team-1", agencyName: "The Diogenes Society", leadInspector: "Mycroft H.", score: 1050, solvedCount: 5, avgSolveMs: 420000 },
  { rank: 2, teamId: "team-baker-221", agencyName: "The Baker Street Irregulars", leadInspector: "Anushka C.", score: 850, solvedCount: 4, avgSolveMs: 510000, isMyTeam: true },
  { rank: 3, teamId: "team-3", agencyName: "The Norwood Syndicate", leadInspector: "James M.", score: 800, solvedCount: 4, avgSolveMs: 540000 },
  { rank: 4, teamId: "team-4", agencyName: "The Baskerville Syndicate", leadInspector: "Henry B.", score: 650, solvedCount: 3, avgSolveMs: 600000 },
  { rank: 5, teamId: "team-5", agencyName: "Red-Headed League", leadInspector: "James W.", score: 500, solvedCount: 3, avgSolveMs: 680000 },
  { rank: 6, teamId: "team-6", agencyName: "The Irene Network", leadInspector: "Irene A.", score: 350, solvedCount: 2, avgSolveMs: 750000 },
  { rank: 7, teamId: "team-7", agencyName: "Scotland Yard Rookies", leadInspector: "Greg L.", score: 200, solvedCount: 1, avgSolveMs: 900000 },
];

// ---- MOCK RESULTS ----
export interface QuestionResult {
  questionId: string;
  title: string;
  points: number;
  earned: number;
  attempts: number;
  correct: boolean;
  solveTimeMs: number;
}

export interface CaseResult {
  caseId: string;
  teamName: string;
  totalScore: number;
  maxScore: number;
  accuracy: number;
  rank: number;
  totalTeams: number;
  questions: QuestionResult[];
}

export const MOCK_RESULTS: CaseResult = {
  caseId: "case-final-problem-2026",
  teamName: "The Baker Street Irregulars",
  totalScore: 850,
  maxScore: 1200,
  accuracy: 80,
  rank: 2,
  totalTeams: 7,
  questions: [
    { questionId: "q1", title: "The Cipher at the North Wing", points: 100, earned: 100, attempts: 1, correct: true, solveTimeMs: 72000 },
    { questionId: "q2", title: "The Telegram Cipher", points: 150, earned: 120, attempts: 2, correct: true, solveTimeMs: 134000 },
    { questionId: "q3", title: "The Witness Statement", points: 200, earned: 200, attempts: 1, correct: true, solveTimeMs: 98000 },
    { questionId: "q4", title: "The Spectrographic Anomaly", points: 250, earned: 150, attempts: 3, correct: true, solveTimeMs: 210000 },
    { questionId: "q5", title: "The Final Deduction", points: 500, earned: 280, attempts: 2, correct: true, solveTimeMs: 300000 },
  ],
};
