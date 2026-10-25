"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTeamSchema,
  joinTeamSchema,
  type CreateTeamInput,
  type JoinTeamInput,
} from "@/lib/validators/team";
import { Button } from "@/components/ui/button";
import { Users, KeyRound, ShieldCheck, UserCheck } from "lucide-react";

export default function TeamPage() {
  const createForm = useForm<CreateTeamInput>({
    resolver: zodResolver(createTeamSchema),
  });

  const joinForm = useForm<JoinTeamInput>({
    resolver: zodResolver(joinTeamSchema),
  });

  const onCreate = (data: CreateTeamInput) => {
    console.log("Chartering agency:", data);
  };

  const onJoin = (data: JoinTeamInput) => {
    console.log("Joining agency via passcode:", data);
  };

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

      <div className="grid gap-6 md:grid-cols-2">
        {/* Create Agency */}
        <div className="parchment-border rounded-lg bg-[#12151C] p-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#DFB75A]" />
            <h2 className="text-lg font-bold text-[#F7F2E7]">
              Charter New Agency
            </h2>
          </div>
          <p className="mt-1 text-xs text-[#D9CEB8]">
            You will be designated as the Lead Inspector with authority to
            invite operatives.
          </p>

          <form
            onSubmit={createForm.handleSubmit(onCreate)}
            className="mt-6 space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold tracking-wider text-[#D9CEB8] uppercase">
                Agency Moniker
              </label>
              <input
                {...createForm.register("name")}
                type="text"
                placeholder="The Baker Street Irregulars"
                className="mt-1 w-full rounded border border-[#2D3344] bg-[#0B0C10] px-3 py-2 text-sm text-[#F7F2E7] placeholder-[#4E5569] focus:border-[#DFB75A] focus:outline-none"
              />
              {createForm.formState.errors.name && (
                <p className="mt-1 text-xs text-[#9E2A2B]">
                  {createForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wider text-[#D9CEB8] uppercase">
                Motto (Optional)
              </label>
              <input
                {...createForm.register("motto")}
                type="text"
                placeholder="Data! Data! Data! I cannot make bricks without clay."
                className="mt-1 w-full rounded border border-[#2D3344] bg-[#0B0C10] px-3 py-2 text-sm text-[#F7F2E7] placeholder-[#4E5569] focus:border-[#DFB75A] focus:outline-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer bg-[#DFB75A] font-semibold text-[#0B0C10] hover:bg-[#C59B27]"
            >
              Charter Agency
            </Button>
          </form>
        </div>

        {/* Join Agency */}
        <div className="parchment-border rounded-lg bg-[#12151C] p-6">
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-[#DFB75A]" />
            <h2 className="text-lg font-bold text-[#F7F2E7]">
              Enlist via Passcode
            </h2>
          </div>
          <p className="mt-1 text-xs text-[#D9CEB8]">
            Enter the 6-character case passcode provided by your Lead Inspector.
          </p>

          <form
            onSubmit={joinForm.handleSubmit(onJoin)}
            className="mt-6 space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold tracking-wider text-[#D9CEB8] uppercase">
                6-Character Passcode
              </label>
              <input
                {...joinForm.register("passcode")}
                type="text"
                maxLength={6}
                placeholder="BAKER7"
                className="mt-1 w-full rounded border border-[#2D3344] bg-[#0B0C10] px-3 py-2 text-center font-mono text-lg tracking-widest text-[#DFB75A] uppercase focus:border-[#DFB75A] focus:outline-none"
              />
              {joinForm.formState.errors.passcode && (
                <p className="mt-1 text-xs text-[#9E2A2B]">
                  {joinForm.formState.errors.passcode.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer border border-[#DFB75A]/40 bg-[#1C202B] font-semibold text-[#DFB75A] hover:bg-[#2D3344]"
            >
              Enter Agency Roster
            </Button>
          </form>
        </div>
      </div>

      {/* Mock Active Roster */}
      <section className="parchment-border rounded-lg bg-[#12151C] p-6">
        <div className="flex items-center justify-between border-b border-[#2D3344] pb-4">
          <div>
            <h3 className="font-bold text-[#F7F2E7]">
              Current Agency: The Baskerville Syndicate
            </h3>
            <p className="text-xs text-[#D9CEB8]">
              Passcode: <span className="font-mono text-[#DFB75A]">BSK221</span>
            </p>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-[#2A7B54]">
            <ShieldCheck className="h-4 w-4" /> Ready for Investigation
          </span>
        </div>

        <div className="mt-4 divide-y divide-[#2D3344]/50">
          <div className="flex items-center justify-between py-2 text-xs">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-[#DFB75A]" />
              <span className="font-semibold text-[#F7F2E7]">
                Lead Inspector (You)
              </span>
            </div>
            <span className="text-[#D9CEB8]">lead.inspector@aot.edu.in</span>
          </div>
        </div>
      </section>
    </div>
  );
}
