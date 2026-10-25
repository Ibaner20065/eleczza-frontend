import type { CreateTeamInput, JoinTeamInput } from "@/lib/validators/team";
import type { DetectiveAgency } from "@/types/team.types";

export async function createAgency(
  input: CreateTeamInput,
): Promise<DetectiveAgency> {
  // Mock / typed service implementation for Phase 1
  return {
    id: "agency-1",
    name: input.name,
    motto: input.motto,
    passcode: "BAKER7",
    leaderId: "user-lead-1",
    members: [],
    score: 0,
    createdAt: "2026-10-25T10:00:00.000Z",
  };
}

export async function joinAgency(
  input: JoinTeamInput,
): Promise<{ success: boolean; agencyName: string }> {
  // Mock / typed service implementation for Phase 1
  return {
    success: true,
    agencyName: `Agency #${input.passcode}`,
  };
}

export async function getAgencyRoster(): Promise<DetectiveAgency | null> {
  return null;
}
