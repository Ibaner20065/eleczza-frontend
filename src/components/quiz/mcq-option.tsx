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

export function McqOption({
  label,
  text,
  state,
  onClick,
  disabled,
  index,
}: McqOptionProps) {
  const reducedMotion = useReducedMotion();

  const stateStyles = {
    idle: "border-fog bg-surface text-parchment hover:border-amber/50 hover:bg-surface hover:text-parchment",
    selected:
      "border-amber bg-amber/10 text-parchment shadow-[0_0_12px_rgb(var(--amber-rgb)/0.25)]",
    correct: "border-amber bg-amber/15 text-parchment",
    incorrect: "border-wax bg-wax/15 text-parchment",
    locked: "border-fog bg-umber text-muted-foreground cursor-not-allowed",
  };

  const Icon =
    state === "correct"
      ? CheckCircle2
      : state === "incorrect"
        ? XCircle
        : Circle;
  const iconColor =
    state === "correct"
      ? "text-amber"
      : state === "incorrect"
        ? "text-wax-foreground"
        : state === "selected"
          ? "text-amber"
          : "text-muted-foreground";

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
        "group flex w-full items-center gap-3 rounded-lg border p-4 text-left text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-1 focus-visible:ring-offset-umber",
        stateStyles[state],
        disabled && "pointer-events-none",
      )}
      initial={reducedMotion ? {} : { opacity: 0, x: -8 }}
      animate={reducedMotion ? {} : { opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.2 }}
    >
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded border font-mono text-xs font-bold transition-colors",
          state === "selected"
            ? "border-amber bg-amber/20 text-amber"
            : state === "correct"
              ? "border-amber bg-amber/20 text-amber"
              : state === "incorrect"
                ? "border-wax bg-wax/20 text-wax-foreground"
                : "border-fog text-muted-foreground",
        )}
      >
        {label}
      </div>
      <span className="flex-1 leading-relaxed">{text}</span>
      <Icon className={cn("h-4 w-4 shrink-0", iconColor)} />
    </motion.button>
  );
}
