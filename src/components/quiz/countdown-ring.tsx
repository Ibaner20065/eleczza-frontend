"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface CountdownRingProps {
  totalSeconds: number;
  remainingSeconds: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function CountdownRing({
  totalSeconds,
  remainingSeconds,
  size = 120,
  strokeWidth = 8,
  className,
}: CountdownRingProps) {
  const reducedMotion = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = remainingSeconds / totalSeconds;
  const offset = circumference * (1 - progress);

  const isUrgent = remainingSeconds < 60;
  const isCritical = remainingSeconds < 20;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const ringColor = isCritical
    ? "var(--wax-foreground)"
    : isUrgent
      ? "var(--wax)"
      : "var(--amber)";
  const glowColor = isCritical
    ? "drop-shadow(0 0 8px rgb(var(--wax-rgb) / 0.7))"
    : isUrgent
      ? "drop-shadow(0 0 6px rgb(var(--wax-rgb) / 0.5))"
      : "drop-shadow(0 0 6px rgb(var(--amber-rgb) / 0.4))";

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)", filter: glowColor }}
        aria-hidden="true"
      >
        {/* Track ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--surface)"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={reducedMotion ? {} : { strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: "linear" }}
          style={{ strokeDashoffset: offset }}
        />
      </svg>

      {/* Center time display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            "font-mono text-xl font-bold leading-none tabular-nums",
            isCritical
              ? "text-wax-foreground"
              : isUrgent
                ? "text-wax-foreground"
                : "text-amber",
          )}
        >
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
        <span className="mt-0.5 text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
          remaining
        </span>
      </div>

      {isCritical && !reducedMotion && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-wax-foreground/40"
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.2, 0.6] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}
