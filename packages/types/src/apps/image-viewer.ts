import { ActionsT } from "../common";
import { FileT } from "../explorer-items";

export interface ImageViewerStateT {
  actions: ActionsT;
  imageViewerInfo: {
    imageFileInfo: FileT | null;
    imageUrl: string | null;
  };
  state: {
    isLoading: boolean;
  };
}
