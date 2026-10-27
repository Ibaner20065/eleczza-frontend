"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaseDossierExploded } from "@/components/theme/case-dossier-exploded";
import { FogBackground } from "@/components/theme/fog-background";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export default function PostLoginTransitionPage() {
  const reducedMotion = useReducedMotion();
  const [showEntranceOverlay, setShowEntranceOverlay] = useState(true);
  const isOverlayActive = showEntranceOverlay && !reducedMotion;

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    // Brief 0.9s cinematic entrance flash: narrow beam & identity confirmation fade into the dossier
    const timer = setTimeout(() => {
      setShowEntranceOverlay(false);
    }, 900);

    return () => clearTimeout(timer);
  }, [reducedMotion]);

  return (
    <div className="relative min-h-screen bg-umber text-parchment overflow-x-hidden">
      <FogBackground density="heavy" />

      {/* Non-blocking Victorian Clearance Badge */}
      <AnimatePresence>
        {isOverlayActive && (
          <div className="pointer-events-none fixed top-6 inset-x-0 z-50 flex justify-center px-4">
            <motion.div
              key="entrance-clearance"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-5 py-2 sm:py-2.5 max-w-[92vw] rounded-full border border-amber/40 bg-charcoal/90 backdrop-blur-md shadow-2xl"
            >
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-serif text-xs font-bold text-parchment"
                style={{
                  background:
                    "radial-gradient(circle at 35% 35%, #b31335 0%, #781329 65%, #0d0907 100%)",
                  border: "1px solid #a3201a",
                  boxShadow: "0 0 10px rgba(179,19,53,0.5)",
                }}
              >
                §
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-archival text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.14em] sm:tracking-[0.25em] text-amber truncate">
                  Identity Verified • Clearance Granted
                </span>
                <span className="font-mono text-[7px] sm:text-[8px] uppercase tracking-wider sm:tracking-widest text-parchment/60 truncate">
                  221B Baker Street Archives Unsealed
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* The Scroll-Driven Exploded Investigation Dossier: Mounted Immediately */}
      <CaseDossierExploded />
    </div>
  );
}
