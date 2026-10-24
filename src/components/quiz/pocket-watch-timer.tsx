"use client";

import { useTimer } from "@/hooks/use-timer";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PocketWatchTimerProps {
  initialSeconds: number;
  onExpire?: () => void;
  className?: string;
}

export function PocketWatchTimer({
  initialSeconds,
  onExpire,
  className,
}: PocketWatchTimerProps) {
  const { formattedTime, isUrgent, isExpired } = useTimer(
    initialSeconds,
    onExpire,
  );

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-sm tracking-widest transition-colors",
        isUrgent
          ? "animate-pulse border-[#9E2A2B] bg-[#9E2A2B]/15 text-[#F7F2E7]"
          : isExpired
            ? "border-[#4E5569] bg-[#12151C] text-[#4E5569]"
            : "border-[#DFB75A]/40 bg-[#12151C] text-[#DFB75A]",
        className,
      )}
    >
      <Clock
        className={cn(
          "h-4 w-4",
          isUrgent ? "text-[#9E2A2B]" : "text-[#DFB75A]",
        )}
      />
      <span>{formattedTime}</span>
    </div>
  );
}
