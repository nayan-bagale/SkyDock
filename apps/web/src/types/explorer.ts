export interface FolderT {
  id: string;
  isFolder: boolean;
  name: string;
  parent: string;
  details: {
    size: number;
    lastModified: string;
  };
  children: string[];
}

export interface FileT {
  id: string;
  isFolder: false;
  name: string;
  parent: string;
  details: {
    name: string;
    size: string;
    type: string;
    lastModified: string;
    // File: File;
  };
}

export interface ExplorerT {
  explorerItems: {
    [key: string]: FileT | FolderT;
  };
  currentFolder: string;
  backStack: string[];
  forwardStack: string[];
  actions: {
    isMinimized: boolean;
    isMaximized: boolean;
    isProcessOn: boolean;
    lastSize: { width: number; height: number };
    lastPosition: { x: number; y: number };
  };
  settings: {
    view: "grid" | "row";
  };
  itemDragged: null | FileT | FolderT;
}
