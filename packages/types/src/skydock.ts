import { AppsT } from "./enums";
import { BrowserApis } from "./enums/browserApi";
import { ExplorerItemT } from "./explorer-items";

export interface SkydockT {
  isLoading: boolean;
  isError: boolean;
  appsMenu: {
    isOpen: boolean;
    isLoading: boolean;
    isProcessOn: boolean;
  };
  browserApis: BrowserApis;
}

export type FocusedAppsT = Exclude<keyof typeof AppsT, "AppsMenu"> | "";

export interface FileDetailsT {
  fileName: string;
  folderId: string;
  path?: string;
  mimeType?: string;
}
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
    lastPosition?: { x: number; y: number };
  }) => void;
  openSaveFileModal: ({
    appName,
    onSuccess,
    onClose,
    supportedMimeTypes,
  }: {
    appName: keyof typeof AppsT;
    onSuccess: (item: FileDetailsT) => Promise<void>;
    onClose: () => void;
    supportedMimeTypes?: string[];
    lastPosition?: { x: number; y: number };
  }) => void;

  restoreFileModal: ({
    appName,
    onSuccess,
    onClose,
    lastPosition,
  }: {
    appName: keyof typeof AppsT;
    onSuccess: (item: ExplorerItemT) => Promise<void>;
    onClose: () => void;
    lastPosition?: { x: number; y: number };
  }) => void;
}
