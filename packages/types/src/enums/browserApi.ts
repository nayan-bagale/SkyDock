export interface BrowserApis {
  camera: {
    permission?: "Allowed" | "Denied" | "Prompt";
    error?: string;
  };
}

export enum BrowserApisErrors {
  CAMERA_PERMISSION_DENIED = "permission denied",
  CAMERA_PERMISSION_DISMISSED = "permission dismissed",
}
