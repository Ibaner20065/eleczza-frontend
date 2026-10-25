"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTeamSchema,
  joinTeamSchema,
  type CreateTeamInput,
  type JoinTeamInput,
} from "@/lib/validators/team";
import {
  createAgency,
  getAgencyRoster,
  joinAgency,
  syncAgencyReadiness,
  updateAgencyReadiness,
} from "@/api/team";
import { startQuiz } from "@/api/event";
import { useUser } from "@/hooks/use-auth";
import type { DetectiveAgency } from "@/types/team.types";
import { Button } from "@/components/ui/button";
import {
  KeyRound,
  ShieldCheck,
  UserCheck,
  Users,
  Copy,
  Play,
  Check,
} from "lucide-react";

export default function TeamPage() {
  const router = useRouter();
  const { user } = useUser();
  const [agency, setAgency] = useState<DetectiveAgency | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const member = useMemo(
    () => ({
      userId: user?.id ?? "demo-inspector",
      fullName:
        (typeof user?.user_metadata.full_name === "string" &&
          user.user_metadata.full_name.trim()) ||
        user?.email?.split("@")[0] ||
        "Inspector",
      email: user?.email ?? "inspector@aot.edu.in",
    }),
    [user],
  );
  const isLeader = agency?.leaderId === member.userId;
  const currentMember = agency?.members.find(
    (teamMember) => teamMember.userId === member.userId,
  );
  const allReady =
    agency?.members.every((teamMember) => teamMember.isReady) ?? false;

  const loadAgency = useCallback(async () => {
    try {
      setAgency(await getAgencyRoster(member.userId));
      setError(null);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load agency details.",
      );
    } finally {
      setLoading(false);
    }
  }, [member.userId]);

  useEffect(() => {
    const initialize = async () => {
      try {
        const syncedAgency = await syncAgencyReadiness(member.userId);
        if (syncedAgency) {
          setAgency(syncedAgency);
          setLoading(false);
        } else {
          await loadAgency();
        }
      } catch (syncError) {
        setError(
          syncError instanceof Error
            ? syncError.message
            : "Unable to sync saved agency readiness.",
        );
        setLoading(false);
      }
    };
    const onReconnect = () => {
      void syncAgencyReadiness(member.userId)
        .then((syncedAgency) => {
          if (syncedAgency) setAgency(syncedAgency);
          setError(null);
        })
        .catch((syncError: unknown) => {
          setError(
            syncError instanceof Error
              ? syncError.message
              : "Unable to sync saved agency readiness.",
          );
        });
    };
    void Promise.resolve().then(initialize);
    window.addEventListener("online", onReconnect);
    return () => window.removeEventListener("online", onReconnect);
  }, [loadAgency, member.userId]);

  const createForm = useForm<CreateTeamInput>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: { name: "", motto: "" },
  });
  const joinForm = useForm<JoinTeamInput>({
    resolver: zodResolver(joinTeamSchema),
    defaultValues: { passcode: "" },
  });

  const onCreate = async (data: CreateTeamInput) => {
    setWorking(true);
    setError(null);
    setNotice(null);
    try {
      setAgency(await createAgency(data, member));
      setNotice(
        "Agency chartered. Invite your operatives with the passcode below.",
      );
      createForm.reset();
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Unable to charter this agency.",
      );
    } finally {
      setWorking(false);
    }
  };

  const onJoin = async (data: JoinTeamInput) => {
    setWorking(true);
    setError(null);
    setNotice(null);
    try {
      setAgency(await joinAgency(data, member));
      setNotice("You have joined the agency roster.");
      joinForm.reset();
    } catch (joinError) {
      setError(
        joinError instanceof Error
          ? joinError.message
          : "Unable to join this agency.",
      );
    } finally {
      setWorking(false);
    }
  };

  const toggleReady = async () => {
    if (!currentMember) return;
    setWorking(true);
    setError(null);
    try {
      setAgency(
        await updateAgencyReadiness(member.userId, !currentMember.isReady),
      );
      if (!navigator.onLine && process.env.NEXT_PUBLIC_MOCK_API !== "true") {
        setNotice(
          "Readiness saved on this device and queued to sync when you reconnect.",
        );
      }
    } catch (readyError) {
      setError(
        readyError instanceof Error
          ? readyError.message
          : "Unable to update readiness.",
      );
    } finally {
      setWorking(false);
    }
  };

  const copyPasscode = async () => {
    if (!agency) return;
    try {
      await navigator.clipboard.writeText(agency.passcode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError(
        "The passcode could not be copied. Select and copy it manually.",
      );
    }
  };

  const beginInvestigation = async () => {
    setWorking(true);
    setError(null);
    try {
      await startQuiz(member.userId);
      router.push("/quiz");
    } catch (startError) {
      setError(
        startError instanceof Error
          ? startError.message
          : "Unable to open the briefing.",
      );
    } finally {
      setWorking(false);
    }
  };

  if (loading) {
    return (
      <p className="text-sm text-[#D9CEB8]" role="status">
        Loading agency records…
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-semibold tracking-wider text-[#DFB75A] uppercase">
          Detective Agency HQ
        </span>
        <h1 className="mt-1 text-2xl font-bold text-[#F7F2E7]">
          Agency Organization
        </h1>
        <p className="text-xs text-[#D9CEB8]">
          Form a syndicate of up to 4 inspectors or enter a secret agency
          passcode.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded border border-[#9E2A2B]/60 bg-[#9E2A2B]/10 p-3 text-sm text-[#F7B7B7]"
        >
          {error}
        </div>
      )}
      {notice && (
        <div
          role="status"
          className="rounded border border-[#2A7B54]/50 bg-[#2A7B54]/10 p-3 text-sm text-[#75C99B]"
        >
          {notice}
        </div>
      )}

      {!agency ? (
        <div className="grid gap-6 md:grid-cols-2">
          <section className="parchment-border rounded-lg bg-[#12151C] p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#DFB75A]" />
              <h2 className="text-lg font-bold text-[#F7F2E7]">
                Charter New Agency
              </h2>
            </div>
            <p className="mt-1 text-xs text-[#D9CEB8]">
              You will be designated as Lead Inspector. An agency can include up
              to four members.
            </p>
            <form
              onSubmit={createForm.handleSubmit(onCreate)}
              className="mt-6 space-y-4"
            >
              <div>
                <label
                  htmlFor="agency-name"
                  className="block text-xs font-semibold tracking-wider text-[#D9CEB8] uppercase"
                >
                  Agency Moniker
                </label>
                <input
                  id="agency-name"
                  {...createForm.register("name")}
                  type="text"
                  maxLength={30}
                  placeholder="The Baker Street Irregulars"
                  className="mt-1 w-full rounded border border-[#2D3344] bg-[#0B0C10] px-3 py-2 text-sm text-[#F7F2E7] placeholder-[#8892B0] focus-visible:border-[#F3D88C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3D88C]"
                />
                {createForm.formState.errors.name && (
                  <p className="mt-1 text-xs text-[#F7B7B7]">
                    {createForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="agency-motto"
                  className="block text-xs font-semibold tracking-wider text-[#D9CEB8] uppercase"
                >
                  Motto (Optional)
                </label>
                <input
                  id="agency-motto"
                  {...createForm.register("motto")}
                  type="text"
                  maxLength={80}
                  placeholder="Trust the evidence."
                  className="mt-1 w-full rounded border border-[#2D3344] bg-[#0B0C10] px-3 py-2 text-sm text-[#F7F2E7] placeholder-[#8892B0] focus-visible:border-[#F3D88C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3D88C]"
                />
              </div>
              <Button
                type="submit"
                disabled={working}
                className="w-full cursor-pointer bg-[#DFB75A] font-semibold text-[#0B0C10] hover:bg-[#C59B27]"
              >
                {working ? "Chartering…" : "Charter Agency"}
              </Button>
            </form>
          </section>

          <section className="parchment-border rounded-lg bg-[#12151C] p-6">
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-[#DFB75A]" />
              <h2 className="text-lg font-bold text-[#F7F2E7]">
                Enlist via Passcode
              </h2>
            </div>
            <p className="mt-1 text-xs text-[#D9CEB8]">
              Enter the six-character passcode provided by your Lead Inspector.
            </p>
            <form
              onSubmit={joinForm.handleSubmit(onJoin)}
              className="mt-6 space-y-4"
            >
              <div>
                <label
                  htmlFor="agency-passcode"
                  className="block text-xs font-semibold tracking-wider text-[#D9CEB8] uppercase"
                >
                  6-Character Passcode
                </label>
                <input
                  id="agency-passcode"
                  {...joinForm.register("passcode", {
                    setValueAs: (value: string) => value.toUpperCase(),
                  })}
                  type="text"
                  maxLength={6}
                  autoCapitalize="characters"
                  placeholder="BSK221"
                  className="mt-1 w-full rounded border border-[#2D3344] bg-[#0B0C10] px-3 py-2 text-center font-mono text-lg tracking-widest text-[#DFB75A] uppercase focus:border-[#DFB75A] focus:outline-none"
                />
                {joinForm.formState.errors.passcode && (
                  <p className="mt-1 text-xs text-[#F7B7B7]">
                    {joinForm.formState.errors.passcode.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={working}
                className="w-full cursor-pointer border border-[#DFB75A]/40 bg-[#1C202B] font-semibold text-[#DFB75A] hover:bg-[#2D3344]"
              >
                {working ? "Enlisting…" : "Enter Agency Roster"}
              </Button>
              {process.env.NEXT_PUBLIC_MOCK_API === "true" && (
                <p className="text-center text-[11px] text-[#8892B0]">
                  Demo passcode:{" "}
                  <span className="font-mono text-[#DFB75A]">BSK221</span>
                </p>
              )}
            </form>
          </section>
        </div>
      ) : (
        <section className="parchment-border rounded-lg bg-[#12151C] p-6">
          <div className="flex flex-col gap-4 border-b border-[#2D3344] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-[#F7F2E7]">{agency.name}</h2>
              {agency.motto && (
                <p className="mt-1 text-xs italic text-[#D9CEB8]">
                  {agency.motto}
                </p>
              )}
              <p className="mt-2 text-xs text-[#D9CEB8]">
                Passcode:{" "}
                <span className="font-mono tracking-widest text-[#DFB75A]">
                  {agency.passcode}
                </span>
                <button
                  type="button"
                  onClick={copyPasscode}
                  className="ml-2 inline-flex items-center gap-1 text-[#DFB75A] hover:underline"
                  aria-label="Copy agency passcode"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </button>
              </p>
            </div>
            <span
              className={`flex items-center gap-1 self-start text-xs font-semibold ${allReady ? "text-[#3EAA75]" : "text-[#D9CEB8]"}`}
            >
              <ShieldCheck className="h-4 w-4" />
              {allReady
                ? "Ready for Investigation"
                : `${agency.members.filter((item) => item.isReady).length}/${agency.members.length} inspectors ready`}
            </span>
          </div>
          <ul
            className="mt-2 divide-y divide-[#2D3344]/50"
            aria-label="Agency members"
          >
            {agency.members.map((teamMember) => (
              <li
                key={teamMember.userId}
                className="flex flex-col gap-1 py-3 text-xs sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="flex items-center gap-2 font-semibold text-[#F7F2E7]">
                  <UserCheck className="h-4 w-4 text-[#DFB75A]" />
                  {teamMember.fullName}
                  {teamMember.userId === member.userId ? " (You)" : ""}
                  <span className="font-normal text-[#8892B0]">
                    · {teamMember.role.replaceAll("_", " ")}
                  </span>
                </span>
                <span className="flex items-center gap-2 text-[#D9CEB8]">
                  {teamMember.email}
                  <span
                    className={
                      teamMember.isReady ? "text-[#3EAA75]" : "text-[#8892B0]"
                    }
                  >
                    {teamMember.isReady ? "Ready" : "Not ready"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col gap-3 border-t border-[#2D3344] pt-4 sm:flex-row sm:items-center sm:justify-between">
            {currentMember ? (
              <Button
                type="button"
                disabled={working}
                onClick={toggleReady}
                className="border border-[#DFB75A]/40 bg-[#1C202B] font-semibold text-[#DFB75A] hover:bg-[#2D3344]"
              >
                {currentMember.isReady ? "I’m not ready" : "Mark me ready"}
              </Button>
            ) : (
              <p className="text-xs text-[#D9CEB8]">
                Your account is not on this agency roster.
              </p>
            )}
            {isLeader && (
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <p className="text-[11px] text-[#8892B0]">
                  Lead Inspector controls
                </p>
                <Button
                  type="button"
                  disabled={working || !allReady}
                  onClick={beginInvestigation}
                  className="bg-[#DFB75A] font-semibold text-[#0B0C10] hover:bg-[#C59B27]"
                >
                  <Play className="mr-2 h-4 w-4" />
                  {working ? "Opening briefing…" : "Start investigation"}
                </Button>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
