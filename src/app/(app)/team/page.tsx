"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTeamSchema,
  joinTeamSchema,
  type CreateTeamInput,
  type JoinTeamInput,
} from "@/lib/validators/team";
import { MOCK_MY_TEAM } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrassButton } from "@/components/theme/brass-button";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";
import {
  Users,
  KeyRound,
  ShieldCheck,
  UserCheck,
  Crown,
  UserMinus,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import type { TeamRole } from "@/types/team.types";

const ROLE_LABELS: Record<TeamRole, string> = {
  LEAD_INSPECTOR: "Lead Inspector",
  CRYPTANALYST: "Cryptanalyst",
  FIELD_AGENT: "Field Agent",
};

const ROLE_OPTIONS: TeamRole[] = [
  "LEAD_INSPECTOR",
  "CRYPTANALYST",
  "FIELD_AGENT",
];

export default function TeamPage() {
  const [myTeam, setMyTeam] = React.useState(MOCK_MY_TEAM);
  const [copiedPasscode, setCopiedPasscode] = React.useState(false);
  const [tab, setTab] = React.useState<"roster" | "create" | "join">("roster");
  const isLeader = true; // mock: current user is leader

  const createForm = useForm<CreateTeamInput>({
    resolver: zodResolver(createTeamSchema),
  });
  const joinForm = useForm<JoinTeamInput>({
    resolver: zodResolver(joinTeamSchema),
  });

  const onCreate = (data: CreateTeamInput) => {
    toast.success("Agency Chartered", {
      description: `"${data.name}" is now registered with Scotland Yard.`,
    });
    createForm.reset();
    setTab("roster");
  };

  const onJoin = (data: JoinTeamInput) => {
    toast.success("Enlisted!", {
      description: `Joined agency via passcode ${data.passcode}.`,
    });
    joinForm.reset();
    setTab("roster");
  };

  const copyPasscode = () => {
    navigator.clipboard.writeText(myTeam.passcode).then(() => {
      setCopiedPasscode(true);
      setTimeout(() => setCopiedPasscode(false), 2000);
    });
  };

  const kickMember = (userId: string) => {
    setMyTeam((t) => ({
      ...t,
      members: t.members.filter((m) => m.userId !== userId),
    }));
    toast.info("Operative dismissed from agency roster.");
  };

  const changeRole = (userId: string, role: TeamRole) => {
    setMyTeam((t) => ({
      ...t,
      members: t.members.map((m) => (m.userId === userId ? { ...m, role } : m)),
    }));
  };

  const toggleReady = (userId: string) => {
    setMyTeam((t) => ({
      ...t,
      members: t.members.map((m) =>
        m.userId === userId ? { ...m, isReady: !m.isReady } : m,
      ),
    }));
  };

  const readyCount = myTeam.members.filter((m) => m.isReady).length;
  const allReady = readyCount === myTeam.members.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-amber">
            <Users className="h-4 w-4" /> Detective Agency HQ
          </div>
          <h1 className="font-script mt-1 text-3xl leading-tight text-parchment">
            {myTeam.name}
          </h1>
          {myTeam.motto && (
            <p className="text-xs italic text-muted-foreground">
              &ldquo;{myTeam.motto}&rdquo;
            </p>
          )}
        </div>
        <div
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
            allReady ? "border-amber text-amber" : "border-amber/40 text-amber"
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          {allReady
            ? "Agency Ready for Investigation"
            : `${readyCount} / ${myTeam.members.length} ready`}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 border-b border-fog pb-0">
        {(["roster", "create", "join"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
              tab === t
                ? "border-amber text-amber"
                : "border-transparent text-muted-foreground hover:text-parchment"
            }`}
          >
            {t === "roster"
              ? "Agency Roster"
              : t === "create"
                ? "Charter Agency"
                : "Enlist via Code"}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ROSTER TAB */}
        {tab === "roster" && (
          <motion.div
            key="roster"
            variants={stagger}
            initial="initial"
            animate="animate"
            className="space-y-4"
          >
            {/* Passcode Banner */}
            <motion.div
              variants={fadeUp}
              className="wood-panel flex items-center justify-between rounded-lg px-5 py-3"
            >
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Agency Passcode — share to invite
                </div>
                <div className="font-mono text-2xl font-bold tracking-widest text-amber">
                  {myTeam.passcode}
                </div>
              </div>
              <button
                type="button"
                onClick={copyPasscode}
                className="flex items-center gap-1.5 rounded border border-fog bg-surface px-3 py-2 text-xs font-semibold text-parchment hover:text-amber transition-colors cursor-pointer"
              >
                {copiedPasscode ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copiedPasscode ? "Copied!" : "Copy Code"}
              </button>
            </motion.div>

            {/* Member Cards */}
            <div className="grid gap-3 sm:grid-cols-2">
              {myTeam.members.map((member) => (
                <motion.div
                  key={member.userId}
                  variants={fadeUp}
                  className="wood-panel space-y-3 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`h-2.5 w-2.5 rounded-full ${
                          member.isReady
                            ? "bg-amber shadow-[0_0_6px_rgb(var(--amber-rgb)/0.6)]"
                            : "bg-muted-foreground"
                        }`}
                      />
                      <div>
                        <div className="flex items-center gap-1.5 font-semibold text-parchment">
                          {member.userId === myTeam.leaderId && (
                            <Crown className="h-3.5 w-3.5 text-amber" />
                          )}
                          {member.fullName}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {member.email}
                        </div>
                      </div>
                    </div>
                    {isLeader && member.userId !== myTeam.leaderId && (
                      <button
                        type="button"
                        onClick={() => kickMember(member.userId)}
                        className="rounded border border-fog bg-umber p-1 text-muted-foreground transition-colors hover:border-wax hover:text-wax-foreground cursor-pointer"
                        title="Remove from agency"
                      >
                        <UserMinus className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    {isLeader && member.userId !== myTeam.leaderId ? (
                      <select
                        value={member.role}
                        onChange={(e) =>
                          changeRole(member.userId, e.target.value as TeamRole)
                        }
                        className="field-control cursor-pointer rounded border border-fog bg-umber px-2 py-1 font-mono text-xs text-parchment focus:border-amber focus:outline-none"
                      >
                        {ROLE_OPTIONS.map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABELS[r]}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="font-mono text-xs text-amber">
                        {ROLE_LABELS[member.role]}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleReady(member.userId)}
                      className={`flex items-center gap-1 rounded border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                        member.isReady
                          ? "border-amber text-amber hover:bg-wax/20 hover:border-wax hover:text-wax-foreground"
                          : "border-fog text-muted-foreground hover:border-amber/50 hover:text-amber"
                      }`}
                    >
                      <UserCheck className="h-3 w-3" />
                      {member.isReady ? "Ready" : "Not Ready"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CREATE TAB */}
        {tab === "create" && (
          <motion.div
            key="create"
            variants={fadeUp}
            initial="initial"
            animate="animate"
            className="wood-panel max-w-lg rounded-xl p-6"
          >
            <h2 className="font-serif text-xl font-bold text-parchment">
              Charter a New Agency
            </h2>
            <p className="mt-1 text-xs text-parchment">
              You will be designated Lead Inspector with full authority over the
              roster.
            </p>
            <form
              onSubmit={createForm.handleSubmit(onCreate)}
              className="mt-6 space-y-4"
            >
              <div className="space-y-1">
                <Label htmlFor="name">Agency Moniker</Label>
                <Input
                  id="name"
                  {...createForm.register("name")}
                  placeholder="The Baker Street Irregulars"
                />
                {createForm.formState.errors.name && (
                  <p className="text-xs text-wax-foreground">
                    {createForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="motto">Motto (Optional)</Label>
                <Input
                  id="motto"
                  {...createForm.register("motto")}
                  placeholder="Data! Data! Data!"
                />
              </div>
              <BrassButton type="submit" size="md" className="w-full">
                Charter Agency
              </BrassButton>
            </form>
          </motion.div>
        )}

        {/* JOIN TAB */}
        {tab === "join" && (
          <motion.div
            key="join"
            variants={fadeUp}
            initial="initial"
            animate="animate"
            className="wood-panel max-w-sm rounded-xl p-6"
          >
            <div className="flex items-center gap-2 text-amber">
              <KeyRound className="h-5 w-5" />
              <h2 className="font-serif text-xl font-bold text-parchment">
                Enlist via Passcode
              </h2>
            </div>
            <p className="mt-1 text-xs text-parchment">
              Enter the 6-character passcode from your Lead Inspector.
            </p>
            <form
              onSubmit={joinForm.handleSubmit(onJoin)}
              className="mt-6 space-y-4"
            >
              <div className="space-y-1">
                <Label htmlFor="passcode">6-Character Passcode</Label>
                <Input
                  id="passcode"
                  {...joinForm.register("passcode")}
                  maxLength={6}
                  placeholder="BSK221"
                  className="font-mono text-center text-xl tracking-widest uppercase text-amber"
                  onChange={(e) => {
                    joinForm.setValue("passcode", e.target.value.toUpperCase());
                  }}
                />
                {joinForm.formState.errors.passcode && (
                  <p className="text-xs text-wax-foreground">
                    {joinForm.formState.errors.passcode.message}
                  </p>
                )}
              </div>
              <Button type="submit" variant="outline" className="w-full">
                Enter Agency Roster
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
