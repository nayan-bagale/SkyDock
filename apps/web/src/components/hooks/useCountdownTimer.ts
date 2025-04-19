import { TimeInMs } from "@skydock/types/enums";
import { useEffect, useRef, useState } from "react";

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function useCountdownTimer(
  defaultDuration: number = TimeInMs.FIVE_MINUTES
) {
  const [remainingTime, setRemainingTime] = useState(defaultDuration);
  const [isExpired, setIsExpired] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = (durationMs: number = defaultDuration) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const durationInSec = Math.floor(durationMs / 1000);

    setRemainingTime(durationInSec);
    setIsExpired(false);

    intervalRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startTimer(); // Start on initial render
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only once on mount

  const timer = formatTime(remainingTime);

  return { timer, startTimer, isExpired };
}
