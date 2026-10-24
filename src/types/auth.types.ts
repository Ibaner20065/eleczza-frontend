export interface InspectorProfile {
  id: string;
  fullName: string;
  email: string;
  rollNumber: string;
  agencyId: string | null;
  rank: string;
  reputationPoints: number;
  solvedCount: number;
  createdAt: string;
}

export type AuthStatus = "authenticated" | "unauthenticated" | "loading";
