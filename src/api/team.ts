import {
  createAgency as createAgencyRequest,
  getAgencyRoster as getAgencyRosterRequest,
  joinAgency as joinAgencyRequest,
  setAgencyMemberReady,
  syncQueuedAgencyReadiness,
} from "@/api/event";
import type { CreateTeamInput, JoinTeamInput } from "@/lib/validators/team";
import type { DetectiveAgency } from "@/types/team.types";

export interface AgencyMemberIdentity {
  userId: string;
  fullName: string;
  email: string;
}

export function createAgency(
  input: CreateTeamInput,
  member: AgencyMemberIdentity,
): Promise<DetectiveAgency> {
  return createAgencyRequest(input, member);
}

export function joinAgency(
  input: JoinTeamInput,
  member: AgencyMemberIdentity,
): Promise<DetectiveAgency> {
  return joinAgencyRequest(input, member);
}

export function getAgencyRoster(
  userId?: string,
): Promise<DetectiveAgency | null> {
  return getAgencyRosterRequest(userId);
}

export function updateAgencyReadiness(
  userId: string,
  isReady: boolean,
): Promise<DetectiveAgency> {
  return setAgencyMemberReady(userId, isReady);
}

export function syncAgencyReadiness(
  userId: string,
): Promise<DetectiveAgency | null> {
  return syncQueuedAgencyReadiness(userId);
}
