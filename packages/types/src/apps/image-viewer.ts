import { ActionsT } from "../common";

export interface ImageViewerStateT {
  actions: ActionsT;
  imageViewer: {
    currentImageId: string | null;
  };
  state: {
    isLoading: boolean;
  };
}
