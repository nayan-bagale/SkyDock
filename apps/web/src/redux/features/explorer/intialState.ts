import { ExplorerT } from "@skydock/types";

const defaultExplorerItems = {
  skydrive: {
    id: "skydrive",
    isFolder: true,
    name: "Sky-Drive",
    parent: "",
    details: {
      size: 0,
      lastModified: "2023-10-01T12:00:00Z",
    },
    children: [],
  },
  documents: {
    id: "documents",
    isFolder: true,
    name: "Documents",
    parent: "",
    details: {
      size: 0,
      lastModified: "2023-10-01T12:00:00Z",
    },
    children: [],
  },
  desktop: {
    id: "desktop",
    isFolder: true,
    name: "Desktop",
    parent: "",
    details: {
      size: 0,
      lastModified: "2023-10-01T12:00:00Z",
    },
    children: [],
  },
  trash: {
    id: "trash",
    isFolder: true,
    name: "Trash",
    parent: "",
    details: {
      size: 0,
      lastModified: "2023-10-01T12:00:00Z",
    },
    children: [],
  },
};

export const initialState = {
  explorerItems: defaultExplorerItems,
  currentFolder: "skydrive",
  backStack: [],
  forwardStack: [],
  activeTab: "skydrive",
  actions: {
    isMinimized: false,
    isMaximized: false,
    isProcessOn: false,
    lastSize: { width: 0, height: 0 },
    lastPosition: { x: 0, y: 0 },
  },
  settings: {
    view: "grid",
  },
  itemDragged: null,
  clipboard: {
    items: [],
    operation: null,
    // sourceFolder: null,
  },
  state: {
    isLoading: false,
  },
} as ExplorerT;
