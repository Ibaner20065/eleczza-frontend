"use client";
import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { stagger, fadeUp } from "@/lib/motion";
import { MOCK_MY_TEAM, MOCK_CASE } from "@/lib/mock-data";
import { TypewriterText } from "@/components/theme/typewriter-text";
import { BrassButton } from "@/components/theme/brass-button";
import { MagnifierLoader } from "@/components/theme/magnifier-loader";
import {
  Users,
  Shield,
  ArrowRight,
  CheckCircle2,
  Circle,
  Volume2,
  VolumeX,
} from "lucide-react";

export default function QuizLobbyPage() {
  const [audioEnabled, setAudioEnabled] = React.useState(false);
  const team = MOCK_MY_TEAM;
  const caseFile = MOCK_CASE;
  const readyCount = team.members.filter((m) => m.isReady).length;
  const allReady = readyCount === team.members.length;

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber/40 bg-surface px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-amber">
          <Shield className="h-3.5 w-3.5" />
          Case Briefing Room — 221B Bureau
        </div>
        <h1 className="font-script text-3xl leading-tight text-parchment">
          {caseFile.title}
        </h1>

        <div className="wood-panel mx-auto max-w-md rounded-lg p-4 font-mono text-xs text-amber">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            INSPECTOR LESTRADE BRIEFING:
          </div>
          <TypewriterText
            text={caseFile.briefing}
            speedMs={20}
            className="text-parchment italic leading-relaxed"
          />
        </div>
      </div>

      {/* Case Metadata */}
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="grid grid-cols-3 gap-4"
      >
        {[
          { label: "Difficulty", value: caseFile.difficulty, icon: "🎯" },
          {
            label: "Duration",
            value: `${caseFile.durationMinutes}m`,
            icon: "⏱",
          },
          {
            label: "Max Points",
            value: `${caseFile.totalPoints} pts`,
            icon: "🏆",
          },
        ].map((item) => (
          <motion.div
            key={item.label}
            variants={fadeUp}
            className="wood-panel rounded-lg p-4 text-center"
          >
            <div className="text-2xl">{item.icon}</div>
            <div className="mt-1 font-mono text-sm font-bold text-amber">
              {item.value}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {item.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Waiting Indicator & Agency Readiness */}
      <div className="wood-panel space-y-5 rounded-xl p-6">
        <div className="flex items-center justify-between border-b border-fog pb-4">
          <div className="flex items-center gap-3">
            <MagnifierLoader label="" size="sm" />
            <div>
              <h2 className="font-serif text-lg font-bold text-parchment">
                {allReady
                  ? "Agency Ready for Investigation!"
                  : "Waiting for the Detective Bureau…"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {allReady
                  ? "All inspectors are positioned. You may proceed."
                  : `${team.members.length - readyCount} operative(s) still preparing.`}
              </p>
            </div>
          </div>

          {/* Audio Toggle */}
          <button
            type="button"
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="rounded border border-fog bg-umber p-2 text-muted-foreground transition-colors hover:text-amber cursor-pointer"
            title="Toggle ambient audio"
          >
            {audioEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Team Ready Status */}
        <div>
          <div className="mb-3 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-amber">
            <Users className="h-3.5 w-3.5" />
            {team.name} — Agency Readiness
          </div>
          <div className="space-y-2">
            {team.members.map((member) => (
              <div
                key={member.userId}
                className="flex items-center justify-between rounded-md border border-fog/60 bg-umber/35 px-4 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  {member.isReady ? (
                    <CheckCircle2 className="h-4 w-4 text-amber" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-semibold text-parchment">
                    {member.fullName}
                  </span>
                </div>
                <span
                  className={`font-mono text-xs font-bold uppercase tracking-wider ${
                    member.isReady ? "text-amber" : "text-muted-foreground"
                  }`}
                >
                  {member.isReady ? "Positioned" : "Preparing…"}
                </span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-1.5 w-full rounded-full bg-surface overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber to-amber"
              initial={{ width: 0 }}
              animate={{
                width: `${(readyCount / team.members.length) * 100}%`,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <div className="mt-1 text-right font-mono text-[10px] text-muted-foreground">
            {readyCount} / {team.members.length} operatives ready
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Link href="/quiz/question" className="w-full sm:w-auto">
          <BrassButton size="lg" withLoupe className="w-full">
            Begin Investigation
            <ArrowRight className="h-4 w-4 ml-1" />
          </BrassButton>
        </Link>
        <Link href="/dashboard" className="w-full sm:w-auto">
          <button
            type="button"
            className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-md border border-parchment/35 bg-transparent px-6 text-xs font-semibold uppercase tracking-wider text-parchment transition-colors hover:border-parchment/70 hover:bg-parchment/5 hover:text-parchment"
          >
            Return to Study
          </button>
        </Link>
      </div>
    </div>
  );
}
