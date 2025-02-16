import { ActionsT } from "./common";

export interface ThemeT {
  id: string;
  color: string;
}
export interface SettingsT {
  apperance: {
    theme: ThemeT;
  };
  actions: ActionsT;
}
