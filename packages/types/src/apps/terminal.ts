import { ActionsT } from "../common";

export interface TerminalT {
  actions: ActionsT;
  state: {
    isLoading: boolean;
  };
}
