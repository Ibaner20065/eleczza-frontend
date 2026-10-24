"use client";

import * as React from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export interface FogBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  density?: "light" | "medium" | "heavy";
}

export function FogBackground({
  density = "medium",
  className,
  ...props
}: FogBackgroundProps) {
  const reducedMotion = useReducedMotion();

  const densityOpacity = {
    light: "opacity-20",
    medium: "opacity-35",
    heavy: "opacity-55",
  }[density];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-[#0B0C10]",
        className,
      )}
      {...props}
    >
      {/* 221B Gaslamp Atmospheric Radial Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(223,183,90,0.12)_0%,rgba(18,21,28,0.7)_50%,rgba(11,12,16,0.98)_100%)]" />

      {/* Layer 1: Foreground London Fog Drifter */}
      {!reducedMotion ? (
        <>
          <div
            className={cn(
              "absolute -inset-[100%] mix-blend-screen transition-opacity duration-1000 animate-[drift_30s_linear_infinite]",
              densityOpacity,
            )}
            style={{
              backgroundImage:
                "radial-gradient(ellipse 60% 40% at 50% 60%, rgba(136,146,176,0.15) 0%, transparent 70%)",
            }}
          />
          {/* Layer 2: Deeper Thames Mist drifting in counter direction */}
          <div
            className={cn(
              "absolute -inset-[100%] mix-blend-screen transition-opacity duration-1000 animate-[driftReverse_45s_linear_infinite]",
              densityOpacity,
            )}
            style={{
              backgroundImage:
                "radial-gradient(ellipse 70% 30% at 40% 40%, rgba(223,183,90,0.06) 0%, transparent 80%)",
            }}
          />
        </>
      ) : (
        /* Reduced motion: Static soft glow without GPU translation */
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#12151C]/40 to-[#0B0C10]" />
      )}
    </div>
  );
}
