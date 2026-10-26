"use client";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Wifi } from "lucide-react";

interface OfflineBannerProps {
  isOnline: boolean;
  hasPendingAnswer: boolean;
}

export function OfflineBanner({
  isOnline,
  hasPendingAnswer,
}: OfflineBannerProps) {
  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          key="offline"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-16 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2 rounded-full border border-wax bg-wax px-4 py-2 text-xs font-semibold text-wax-foreground shadow-xl"
        >
          <WifiOff className="h-3.5 w-3.5" />
          Connection lost — your answers are saved locally. Reconnecting…
        </motion.div>
      )}
      {isOnline && hasPendingAnswer && (
        <motion.div
          key="reconnecting"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-16 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2 rounded-full border border-amber bg-amber/20 px-4 py-2 text-xs font-semibold text-amber shadow-xl"
        >
          <Wifi className="h-3.5 w-3.5 animate-pulse" />
          Back online — syncing deduction with Scotland Yard…
        </motion.div>
      )}
    </AnimatePresence>
  );
}
