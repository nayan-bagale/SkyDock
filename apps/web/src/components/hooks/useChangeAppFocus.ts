import { setFocusedApp } from "@/redux/features/apps/appsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { AppsT } from "@skydock/types/enums";
import { useEffect } from "react";

const useChangeAppFocus = (AppName: keyof typeof AppsT | "") => {
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
    };
  }, []);

  return { handleAppFocus };
};

export default useChangeAppFocus;
