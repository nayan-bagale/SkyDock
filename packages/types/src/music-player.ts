import { ActionsT } from "./common";

export interface MusicPlayerStateT {
  actions: ActionsT;
  musicPlayer: {
    currentMusicId: string | null;
  };
}
