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
          ? "animate-pulse border-wax bg-wax/15 text-parchment"
          : isExpired
            ? "border-muted-foreground bg-surface text-muted-foreground"
            : "border-amber/40 bg-surface text-amber",
        className,
      )}
    >
      <Clock
        className={cn(
          "h-4 w-4",
          isUrgent ? "text-wax-foreground" : "text-amber",
        )}
      />
      <span>{formattedTime}</span>
    </div>
  );
}
