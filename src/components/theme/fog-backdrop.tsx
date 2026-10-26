"use client";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function FogBackdrop() {
  const reducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-umber"
    >
      {/* Victorian gaslamp ambiance */}
      <div className="fog-ambient absolute inset-0" />

      {/* Ambient smoke / fog layer */}
      {!reducedMotion && (
        <div
          className="absolute inset-0 opacity-20 mix-blend-screen transition-opacity duration-1000"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, rgb(var(--amber-rgb)/0.15) 0%, transparent 60%)",
          }}
        />
      )}
    </div>
  );
}
