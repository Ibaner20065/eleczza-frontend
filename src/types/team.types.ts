export type TeamRole = "LEAD_INSPECTOR" | "CRYPTANALYST" | "FIELD_AGENT";

export interface TeamMember {
  userId: string;
  fullName: string;
  email: string;
  role: TeamRole;
  isReady: boolean;
}

export interface DetectiveAgency {
  id: string;
  name: string;
  motto?: string;
  passcode: string;
  leaderId: string;
  members: TeamMember[];
  score: number;
  rank?: number;
  createdAt: string;
}
