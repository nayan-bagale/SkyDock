import {
  changeBackground,
  changeTheme,
} from "@/redux/features/settings/settingsSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect } from "react";

const useTheme = () => {
  // const theme = useAppSelector((state) => state.settings.apperance.theme);
  // const background = useAppSelector(
  //   (state) => state.settings.apperance.background
  // );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const savedSettings = localStorage.getItem("settings");
    // console.log("savedSettings", savedSettings);
    if (savedSettings) {
      const { theme, background } = JSON.parse(savedSettings);
      dispatch(changeTheme(theme));
      dispatch(changeBackground(background));
      document.body.style.backgroundImage = `url(${background?.src})`;
      document.body.style.backgroundRepeat = "no-repeat";
    }
  }, []);

  // useEffect(() => {
  //   if (!theme || !background) return;
  //   localStorage.setItem("settings", JSON.stringify({ theme, background }));
  // }, [theme, background]);
};

export default useTheme;
