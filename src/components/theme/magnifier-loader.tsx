"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface MagnifierLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function MagnifierLoader({
  label = "Examining Forensic Evidence...",
  size = "md",
  className,
  ...props
}: MagnifierLoaderProps) {
  const reducedMotion = useReducedMotion();

  const dimensions = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  }[size];

  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-4",
        className,
      )}
      {...props}
    >
      <div
        className={cn("relative flex items-center justify-center", dimensions)}
      >
        {/* Outer Brass Ring */}
        <div
          className={cn(
            "absolute inset-0 rounded-full border-2 border-amber shadow-[0_0_12px_rgb(var(--amber-rgb)/0.4)]",
            !reducedMotion && "animate-[spin_4s_linear_infinite]",
          )}
        >
          {/* Magnifier Glass Glare Arc */}
          <span className="absolute top-0.5 left-1/4 h-1.5 w-1/2 rounded-full bg-white/40 blur-[0.5px]" />
        </div>

        {/* Optical Lens Core */}
        <div className="absolute inset-1 rounded-full bg-amber/10 backdrop-blur-xs flex items-center justify-center overflow-hidden">
          {/* Sweeping Inspection Spotlight */}
          {!reducedMotion ? (
            <div className="h-full w-full bg-gradient-to-tr from-transparent via-amber/25 to-transparent animate-[pulse_2s_ease-in-out_infinite]" />
          ) : (
            <div className="h-2 w-2 rounded-full bg-amber" />
          )}
        </div>

        {/* Diagonal Brass Handle */}
        <div className="absolute -bottom-1.5 -right-1.5 h-3.5 w-1 bg-gradient-to-b from-amber to-muted-foreground rounded-sm transform rotate-45 shadow-sm" />
      </div>

      {label && (
        <p className="font-mono text-xs tracking-wider uppercase text-amber animate-pulse">
          {label}
        </p>
      )}
    </div>
  );
}
