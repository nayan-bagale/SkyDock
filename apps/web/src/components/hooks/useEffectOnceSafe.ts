import { useEffect, useRef } from "react";

/**
 * useEffectOnceSafe - Runs a side-effect only once, even in React Strict Mode
 * @param effect A function that runs once on mount and optionally returns a cleanup function
 */
export function useEffectOnceSafe(effect: () => void | (() => void)) {
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const cleanup = effect();
    return cleanup;
  }, []);
}
