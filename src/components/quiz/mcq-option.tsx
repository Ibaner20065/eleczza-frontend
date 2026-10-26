"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Circle } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface McqOptionProps {
  label: string; // "A", "B", "C", "D"
  text: string;
  state: "idle" | "selected" | "correct" | "incorrect" | "locked";
  onClick: () => void;
  disabled?: boolean;
  index: number;
}

export function McqOption({ label, text, state, onClick, disabled, index }: McqOptionProps) {
  const reducedMotion = useReducedMotion();

  const stateStyles = {
    idle: "border-[#2D3344] bg-[#12151C] text-[#D9CEB8] hover:border-[#DFB75A]/50 hover:bg-[#1C202B] hover:text-[#F4EBD9]",
    selected: "border-[#DFB75A] bg-[#DFB75A]/10 text-[#F7F2E7] shadow-[0_0_12px_rgba(223,183,90,0.25)]",
    correct: "border-[#2A7B54] bg-[#2A7B54]/15 text-[#F7F2E7]",
    incorrect: "border-[#8B1E22] bg-[#8B1E22]/15 text-[#F7F2E7]",
    locked: "border-[#2D3344] bg-[#0B0C10] text-[#4E5569] cursor-not-allowed",
  };

  const Icon = state === "correct" ? CheckCircle2 : state === "incorrect" ? XCircle : Circle;
  const iconColor = state === "correct" ? "text-[#3EAA75]" : state === "incorrect" ? "text-[#C93B41]" : state === "selected" ? "text-[#DFB75A]" : "text-[#4E5569]";

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && !disabled) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={state === "selected" || state === "correct"}
      tabIndex={disabled ? -1 : 0}
      disabled={disabled}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "group flex w-full items-center gap-3 rounded-lg border p-4 text-left text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DFB75A] focus-visible:ring-offset-1 focus-visible:ring-offset-[#0B0C10]",
        stateStyles[state],
        disabled && "pointer-events-none"
      )}
      initial={reducedMotion ? {} : { opacity: 0, x: -8 }}
      animate={reducedMotion ? {} : { opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.2 }}
    >
      <div className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded border font-mono text-xs font-bold transition-colors",
        state === "selected" ? "border-[#DFB75A] bg-[#DFB75A]/20 text-[#DFB75A]" :
        state === "correct" ? "border-[#2A7B54] bg-[#2A7B54]/20 text-[#3EAA75]" :
        state === "incorrect" ? "border-[#8B1E22] bg-[#8B1E22]/20 text-[#C93B41]" :
        "border-[#2D3344] text-[#8892B0]"
      )}>
        {label}
      </div>
      <span className="flex-1 leading-relaxed">{text}</span>
      <Icon className={cn("h-4 w-4 shrink-0", iconColor)} />
    </motion.button>
  );
}
