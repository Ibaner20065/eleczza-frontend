"use client";
import { useEffect, useState } from "react";
import { useTimer } from "@/hooks/use-timer";
import { Clock } from "lucide-react";

interface DashboardCountdownProps {
  targetIso: string;
}

export function DashboardCountdown({ targetIso }: DashboardCountdownProps) {
  const [initialSeconds, setInitialSeconds] = useState<number | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const target = new Date(targetIso).getTime();
      setInitialSeconds(Math.max(0, Math.floor((target - Date.now()) / 1000)));
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [targetIso]);

  if (initialSeconds === null) {
    return (
      <div
        aria-label="Loading event countdown"
        aria-busy="true"
        className="h-[104px] w-[260px] animate-pulse rounded-lg border border-amber/20 bg-surface"
      />
    );
  }

  return <Countdown initialSeconds={initialSeconds} />;
}

function Countdown({ initialSeconds }: { initialSeconds: number }) {
  const { secondsRemaining, isExpired } = useTimer(initialSeconds);

  const d = Math.floor(secondsRemaining / 86400);
  const h = Math.floor((secondsRemaining % 86400) / 3600);
  const m = Math.floor((secondsRemaining % 3600) / 60);
  const s = secondsRemaining % 60;

  if (isExpired) {
    return (
      <div className="rounded-lg border border-amber bg-amber/15 px-6 py-4 text-center">
        <div className="font-mono text-xs font-bold uppercase tracking-widest text-amber">
          Investigation Active
        </div>
        <div className="mt-1 font-serif text-2xl font-bold text-parchment">
          Game is Afoot!
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-amber/40 bg-surface px-6 py-4 text-center shadow-[0_0_20px_rgb(var(--amber-rgb)/0.1)]">
      <div className="flex items-center justify-center gap-1 font-mono text-xs font-bold uppercase tracking-widest text-amber">
        <Clock className="h-3.5 w-3.5" />
        Case Opens In
      </div>
      <div className="mt-2 flex items-end justify-center gap-2 font-mono tabular-nums">
        {d > 0 && (
          <div className="text-center">
            <div className="text-3xl font-bold text-parchment">
              {String(d).padStart(2, "0")}
            </div>
            <div className="text-[10px] text-muted-foreground">DAYS</div>
          </div>
        )}
        <div className="text-center">
          <div className="text-3xl font-bold text-parchment">
            {String(h).padStart(2, "0")}
          </div>
          <div className="text-[10px] text-muted-foreground">HRS</div>
        </div>
        <div className="pb-0.5 text-2xl font-bold text-amber">:</div>
        <div className="text-center">
          <div className="text-3xl font-bold text-parchment">
            {String(m).padStart(2, "0")}
          </div>
          <div className="text-[10px] text-muted-foreground">MIN</div>
        </div>
        <div className="pb-0.5 text-2xl font-bold text-amber">:</div>
        <div className="text-center">
          <div className="text-3xl font-bold text-parchment">
            {String(s).padStart(2, "0")}
          </div>
          <div className="text-[10px] text-muted-foreground">SEC</div>
        </div>
      </div>
    </div>
  );
}
