import { setFocusedApp } from "@/redux/features/apps/appsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { FocusedAppsT } from "@skydock/types";
import { useEffect } from "react";

const useChangeAppFocus = (
  AppName: FocusedAppsT,
  onUnmountCallback?: () => void
) => {
  const dispatch = useAppDispatch();
  const focusedApp = useAppSelector((state) => state.apps.focusedApp);

  const handleAppFocus = () => {
    if (focusedApp !== AppName) {
      dispatch(setFocusedApp(AppName));
    }
  };

  useEffect(() => {
    dispatch(setFocusedApp(AppName));
    return () => {
      dispatch(setFocusedApp(""));
      if (onUnmountCallback) {
        onUnmountCallback();
      }
    };
  }, []);

  return { handleAppFocus };
};

export default useChangeAppFocus;
