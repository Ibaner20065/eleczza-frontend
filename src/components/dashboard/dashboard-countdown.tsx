"use client";
import { useTimer } from "@/hooks/use-timer";
import { Clock } from "lucide-react";

interface DashboardCountdownProps {
  targetIso: string;
}

export function DashboardCountdown({ targetIso }: DashboardCountdownProps) {
  const target = new Date(targetIso).getTime();
  const now = Date.now();
  const diffSeconds = Math.max(0, Math.floor((target - now) / 1000));
  const { secondsRemaining, isExpired } = useTimer(diffSeconds);

  const d = Math.floor(secondsRemaining / 86400);
  const h = Math.floor((secondsRemaining % 86400) / 3600);
  const m = Math.floor((secondsRemaining % 3600) / 60);
  const s = secondsRemaining % 60;

  if (isExpired) {
    return (
      <div className="rounded-lg border border-[#2A7B54] bg-[#2A7B54]/15 px-6 py-4 text-center">
        <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#3EAA75]">
          Investigation Active
        </div>
        <div className="mt-1 font-serif text-2xl font-bold text-[#F7F2E7]">Game is Afoot!</div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#DFB75A]/40 bg-[#12151C] px-6 py-4 text-center shadow-[0_0_20px_rgba(223,183,90,0.1)]">
      <div className="flex items-center justify-center gap-1 font-mono text-xs font-bold uppercase tracking-widest text-[#DFB75A]">
        <Clock className="h-3.5 w-3.5" />
        Case Opens In
      </div>
      <div className="mt-2 flex items-end justify-center gap-2 font-mono tabular-nums">
        {d > 0 && (
          <div className="text-center">
            <div className="text-3xl font-bold text-[#F7F2E7]">{String(d).padStart(2, "0")}</div>
            <div className="text-[10px] text-[#4E5569]">DAYS</div>
          </div>
        )}
        <div className="text-center">
          <div className="text-3xl font-bold text-[#F7F2E7]">{String(h).padStart(2, "0")}</div>
          <div className="text-[10px] text-[#4E5569]">HRS</div>
        </div>
        <div className="pb-0.5 text-2xl font-bold text-[#DFB75A]">:</div>
        <div className="text-center">
          <div className="text-3xl font-bold text-[#F7F2E7]">{String(m).padStart(2, "0")}</div>
          <div className="text-[10px] text-[#4E5569]">MIN</div>
        </div>
        <div className="pb-0.5 text-2xl font-bold text-[#DFB75A]">:</div>
        <div className="text-center">
          <div className="text-3xl font-bold text-[#F7F2E7]">{String(s).padStart(2, "0")}</div>
          <div className="text-[10px] text-[#4E5569]">SEC</div>
        </div>
      </div>
    </div>
  );
}
