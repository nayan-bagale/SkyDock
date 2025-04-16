import { ActionsT } from "./common";

export interface ThemeT {
  id: string;
  color: string;
}

export interface BackgroundT {
  id: string;
  src: string;
}

export interface SettingsT {
  apperance: {
    theme: ThemeT | null;
    background: BackgroundT | null;
  };
  actions: ActionsT;
}
