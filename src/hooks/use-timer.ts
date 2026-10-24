"use client";

import { useEffect, useState } from "react";

export function useTimer(initialSeconds: number, onExpire?: () => void) {
  const [secondsRemaining, setSecondsRemaining] =
    useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  useEffect(() => {
    if (!isRunning || secondsRemaining <= 0) {
      if (secondsRemaining <= 0 && onExpire) {
        onExpire();
      }
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, secondsRemaining, onExpire]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return {
    secondsRemaining,
    formattedTime,
    isUrgent: secondsRemaining < 60 && secondsRemaining > 0,
    isExpired: secondsRemaining === 0,
    pause: () => setIsRunning(false),
    resume: () => setIsRunning(true),
    reset: (newSeconds: number) => setSecondsRemaining(newSeconds),
  };
}
