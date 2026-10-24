"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface TypewriterTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  speedMs?: number;
  delayMs?: number;
  onComplete?: () => void;
  showCursor?: boolean;
}

export function TypewriterText({
  text,
  speedMs = 35,
  delayMs = 150,
  onComplete,
  showCursor = true,
  className,
  ...props
}: TypewriterTextProps) {
  const reducedMotion = useReducedMotion();
  const [charCount, setCharCount] = React.useState<number>(0);

  React.useEffect(() => {
    if (reducedMotion) {
      return;
    }

    let timer: NodeJS.Timeout;

    const delayTimeout = setTimeout(() => {
      timer = setInterval(() => {
        setCharCount((prev) => {
          if (prev < text.length) {
            const next = prev + 1;
            if (next >= text.length) {
              onComplete?.();
            }
            return next;
          }
          clearInterval(timer);
          return prev;
        });
      }, speedMs);
    }, delayMs);

    return () => {
      clearTimeout(delayTimeout);
      clearInterval(timer);
    };
  }, [text, speedMs, delayMs, reducedMotion, onComplete]);

  const isTypingDone = reducedMotion || charCount >= text.length;
  const displayedText = reducedMotion ? text : text.slice(0, charCount);

  return (
    <span
      className={cn("inline-block font-mono tracking-wide", className)}
      {...props}
    >
      {displayedText}
      {showCursor && !isTypingDone && (
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block w-1.5 h-3.5 bg-[#DFB75A] animate-[ping_0.8s_steps(2)_infinite]"
        />
      )}
    </span>
  );
}
