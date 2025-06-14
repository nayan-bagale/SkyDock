import { AppsT } from "./enums";
import { ExplorerItemT } from "./explorer-items";

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

export interface FileSaveAndOpenModalT {
  openFileOpenerModal: ({
    appName,
    onSuccess,
    onClose,
    supportedMimeTypes,
  }: {
    appName: keyof typeof AppsT;
    onSuccess: (item: ExplorerItemT) => Promise<void>;
    onClose: () => void;
    supportedMimeTypes?: string[];
  }) => void;
  openSaveFileModal: ({
    appName,
    onSuccess,
    onClose,
    supportedMimeTypes,
  }: {
    appName: keyof typeof AppsT;
    onSuccess: (item: ExplorerItemT["id"]) => Promise<void>;
    onClose: () => void;
    supportedMimeTypes?: string[];
  }) => void;
}
