import { ActionsT } from "../common";

export interface VideoPlayerStateT {
  actions: ActionsT;
  videoPlayer: {
    currentVideoId: string | null;
  };
}
