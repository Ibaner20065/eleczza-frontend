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

  const ringColor = isCritical ? "#C93B41" : isUrgent ? "#A8262B" : "#DFB75A";
  const glowColor = isCritical
    ? "drop-shadow(0 0 8px rgba(201,59,65,0.7))"
    : isUrgent
    ? "drop-shadow(0 0 6px rgba(168,38,43,0.5))"
    : "drop-shadow(0 0 6px rgba(223,183,90,0.4))";

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
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
          stroke="#1C202B"
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
            isCritical ? "text-[#C93B41]" : isUrgent ? "text-[#A8262B]" : "text-[#DFB75A]"
          )}
        >
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
        <span className="mt-0.5 text-[9px] font-mono uppercase tracking-widest text-[#4E5569]">
          remaining
        </span>
      </div>

      {isCritical && !reducedMotion && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[#C93B41]/40"
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.2, 0.6] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}
