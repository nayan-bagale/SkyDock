import { background as bgEnum, theme as themeEnum } from "@/constants/settings";
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
      let { theme, background } = JSON.parse(savedSettings);
      if (background && !background.src.includes("wallpapers/")) {
        // If the theme is not a valid background, set it to default
        theme = themeEnum[2]; // Default theme
        background = bgEnum[0]; // Default background
      }

      dispatch(changeTheme(theme));
      dispatch(changeBackground(background));
      document.body.style.backgroundImage = `url(${background?.src})`;
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
    } else {
      // Set default theme and background if not found in localStorage
      dispatch(changeTheme(themeEnum[2])); // Default theme
      dispatch(changeBackground(bgEnum[0])); // Default background
      document.body.style.backgroundImage = `url(${bgEnum[0]?.src})`;
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
    }
  }, []);
};

export default useTheme;
