import { AppsT } from "./enums";

export interface SkydockT {
  isLoading: boolean;
  isError: boolean;
  appsMenu: {
    isOpen: boolean;
    isLoading: boolean;
    isProcessOn: boolean;
  };
}

export type FocusedAppsT = Exclude<keyof typeof AppsT, "AppsMenu"> | "";
