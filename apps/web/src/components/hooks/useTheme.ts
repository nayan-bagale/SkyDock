import { background, theme } from "@/constants/settings";
import {
  changeBackground,
  changeTheme,
} from "@/redux/features/settings/settingsSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect } from "react";

const useTheme = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const savedSettings = localStorage.getItem("settings");

    if (savedSettings) {
      const { theme, background } = JSON.parse(savedSettings);
      dispatch(changeTheme(theme));
      dispatch(changeBackground(background));
      document.body.style.backgroundImage = `url(${background?.src})`;
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
    } else {
      // Set default theme and background if not found in localStorage
      dispatch(changeTheme(theme[2])); // Default theme
      dispatch(changeBackground(background[0])); // Default background
      document.body.style.backgroundImage = `url(${background[0]?.src})`;
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
    }
  }, []);
};

export default useTheme;
