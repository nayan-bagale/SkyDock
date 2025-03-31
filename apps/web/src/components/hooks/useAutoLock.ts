import { lockScreen } from "@/redux/features/lockScreen/lockScreenSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";

const useAutoLock = (inactivityTime = 5 * 60 * 1000) => {
  // Default: 5 minutes
  const dispatch = useAppDispatch();
  const isLocked = useAppSelector((state) => state.lockScreen.isLocked);

  useEffect(() => {
    if (isLocked) return;

    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        dispatch(lockScreen());
      }, inactivityTime);
    };

    // Events that reset the timer
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Initialize timer
    resetTimer();

    // Cleanup
    return () => {
      clearTimeout(timer);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [dispatch, inactivityTime, isLocked]);
};

export default useAutoLock;
