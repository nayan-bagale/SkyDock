export interface ActionsT {
  isMinimized?: boolean;
  isMaximized?: boolean;
  isProcessOn: boolean;
  isFileActionModalOn?: boolean;
  lastSize?: { width: number; height: number };
  lastPosition?: { x: number; y: number };
}
