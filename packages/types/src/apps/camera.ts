import { ActionsT } from "../common";

export interface CameraStateT {
  actions: ActionsT;
  cameraInfo: any;
  state: {
    isLoading: boolean;
  };
}
