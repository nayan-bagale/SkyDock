import { X_POSITION, Y_POSITION } from "@/constants";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExplorerT, FileT, FolderT } from "@skydock/types";

const initalState = {
  explorerItems: {
    skydrive: {
      id: "skydrive",
      isFolder: true,
      name: "Sky-Drive",
      parent: "",
      details: {
        size: 0,
        lastModified: "2023-10-01T12:00:00Z",
      },
      // children: ["file1", "folder1"],
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
      // children: ["file1", "folder1"],
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
      // children: ["file1", "folder1"],
      children: [],
    },
    // file1: {
    //   id: "file1",
    //   isFolder: false,
    //   name: "file1.txt",
    //   parent: "skydrive",
    //   state: {
    //     currentState: "idle",
    //     progress: 0,
    //   },
    //   details: {
    //     name: "file1.txt",
    //     size: "15KB",
    //     type: "application/pdf",
    //     lastModified: "2023-10-01T12:00:00Z",
    //     // File: new File(["content"], "file1.txt", { type: "text/plain" }),
    //   },
    // },
    // folder1: {
    //   id: "folder1",
    //   isFolder: true,
    //   name: "folder1",
    //   parent: "skydrive",
    //   details: {
    //     size: 0,
    //     lastModified: "2023-10-02T12:00:00Z",
    //   },
    //   children: [],
    // },
    // file2: {
    //   id: "file2",
    //   isFolder: false,
    //   name: "file2.jpg",
    //   parent: "folder1",
    //   details: {
    //     name: "file2.jpg",
    //     size: "200KB",
    //     type: "image/jpeg",
    //     lastModified: "2023-10-02T12:00:00Z",
    //     // File: new File(["content"], "file2.jpg", { type: "image/jpeg" }),
    //   },
    // },
  },
  currentFolder: "skydrive",
  backStack: [],
  forwardStack: [],
  activeTab: "skydrive",
  actions: {
    isMinimized: false,
    isMaximized: false,
    isProcessOn: false,
    lastSize: { width: 0, height: 0 },
    lastPosition: { x: X_POSITION, y: Y_POSITION },
  },
  settings: {
    view: "grid",
  },
  itemDragged: null,
} as ExplorerT;

export const explorerSlice = createSlice({
  name: "explorer",
  initialState: initalState,
  reducers: {
    // addItem: (state, action) => {
    //   const currentFolderItem = state.explorerItems[state.currentFolder];
    //   if (currentFolderItem.isFolder) {
    //     const uniqueChildren =
    //       currentFolderItem.id === action.payload.parent
    //         ? new Set([...currentFolderItem.children, action.payload.id])
    //         : new Set([...currentFolderItem.children]);
    //     state.explorerItems = {
    //       ...state.explorerItems,
    //       [state.currentFolder]: {
    //         ...currentFolderItem,
    //         children: [...uniqueChildren],
    //       },
    //       [action.payload.id]: action.payload,
    //     };
    //   }
    // },

    addItem: (state, action) => {
      const drives: ExplorerT["activeTab"][] = ["skydrive", "desktop", "trash"];
      if (drives.includes(action.payload.parent)) {
        const currentDriveItem = state.explorerItems[
          action.payload.parent
        ] as FolderT;
        state.explorerItems = {
          ...state.explorerItems,
          [currentDriveItem.id]: {
            ...currentDriveItem,
            children: [...currentDriveItem.children, action.payload.id],
          },
          [action.payload.id]: action.payload,
        };
      } else {
        const currentFolderItem = state.explorerItems[action.payload.parent];
        if (currentFolderItem.isFolder) {
          const uniqueChildren =
            currentFolderItem.id === action.payload.parent
              ? new Set([...currentFolderItem.children, action.payload.id])
              : new Set([...currentFolderItem.children]);
          state.explorerItems = {
            ...state.explorerItems,
            [state.currentFolder]: {
              ...currentFolderItem,
              children: [...uniqueChildren],
            },
            [action.payload.id]: action.payload,
          };
        }
      }
    },

    deleteItem: (state, action) => {
      const deleteRecursively = (itemId: FolderT["id"]) => {
        const item = state.explorerItems[itemId];
        if (item.isFolder) {
          item.children.forEach((childId) => {
            deleteRecursively(childId);
          });
        }
        delete state.explorerItems[itemId];
      };

      const currentFolderItem = state.explorerItems[action.payload.parent];
      if (currentFolderItem.isFolder) {
        state.explorerItems = {
          ...state.explorerItems,
          [currentFolderItem.id]: {
            ...currentFolderItem,
            children: currentFolderItem.children.filter(
              (child) => child !== action.payload.id
            ),
          },
        };
        deleteRecursively(action.payload.id);
      }
    },
    renameItem: (state, action) => {
      const item = state.explorerItems[action.payload.id];
      state.explorerItems = {
        ...state.explorerItems,
        [action.payload.id]: {
          ...item,
          name: action.payload.name,
        },
      };
    },
    updateItemState: (state, action) => {
      const item = state.explorerItems[action.payload.id];
      state.explorerItems = {
        ...state.explorerItems,
        [action.payload.id]: {
          ...item,
          state: action.payload.state,
        },
      };
    },

    moveFileIntoFolder: (
      state,
      action: PayloadAction<{ fileId: FileT["id"]; folderId: FolderT["id"] }>
    ) => {
      const { fileId, folderId } = action.payload;

      const fileItem = state.explorerItems[fileId] as FileT;
      const folderItem = state.explorerItems[folderId] as FolderT;

      state.explorerItems = {
        ...state.explorerItems,
        [fileItem.parent]: {
          ...state.explorerItems[fileItem.parent],
          children: (
            state.explorerItems[fileItem.parent] as FolderT
          ).children.filter((childId) => childId !== fileId),
        } as FolderT,
        [folderId]: {
          ...folderItem,
          children: [...(folderItem as FolderT).children, fileItem.id],
        },
        [fileId]: {
          ...fileItem,
          parent: folderId,
        },
      };
    },

    setCurrentFolder: (state, action) => {
      state.backStack.push(state.currentFolder);
      state.currentFolder = action.payload;
    },

    setCurrentFolderAndCurrentTab: (
      state,
      action: PayloadAction<{
        currentFolder: string;
        activeTab: ExplorerT["activeTab"];
      }>
    ) => {
      state.currentFolder = action.payload.currentFolder;
      state.activeTab = action.payload.activeTab;
      state.backStack = [];
      state.forwardStack = [];
    },
    setForwardStack: (state) => {
      const temp = state.forwardStack.pop();
      if (temp) state.backStack.push(temp);
      state.currentFolder =
        state.forwardStack[state.forwardStack.length - 1] || "skydrive";
    },
    setBackStack: (state) => {
      const temp = state.backStack.pop();
      if (temp) state.currentFolder = temp;
    },
    changeView: (state, action) => {
      state.settings.view = action.payload;
    },

    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
      state.currentFolder = action.payload;
      state.backStack = [];
      state.forwardStack = [];
    },

    setBreadCrumb: (state, action) => {
      state.currentFolder = action.payload;
      const index = state.backStack.indexOf(action.payload);
      if (index !== -1) {
        state.backStack = state.backStack.slice(0, index);
      }
    },

    explorerProcess: (state, action) => {
      state.currentFolder = "skydrive";
      state.backStack = [];
      state.forwardStack = [];
      state.actions.isProcessOn = action.payload;
    },

    openExplorer: (state) => {
      state.actions.isProcessOn = true;
    },

    changeExplorerSize: (state) => {
      state.actions.isMaximized = !state.actions.isMaximized;
    },
    changeExplorerMinimized: (state) => {
      state.actions.isMinimized = !state.actions.isMinimized;
    },

    changeExplorerLastSize: (state, action) => {
      state.actions.lastSize = action.payload;
    },

    // drag and drop
    setItemDragged: (state, action) => {
      state.itemDragged = action.payload;
    },
  },
});

export const {
  addItem,
  // iniitalizeExplorerItems,
  setCurrentFolder,
  setCurrentFolderAndCurrentTab,
  setForwardStack,
  setBackStack,
  setBreadCrumb,
  deleteItem,
  renameItem,
  updateItemState,
  moveFileIntoFolder,
  changeView,
  explorerProcess,
  openExplorer,
  changeExplorerSize,
  changeExplorerMinimized,
  changeExplorerLastSize,
  setItemDragged,
  setActiveTab,
} = explorerSlice.actions;

export default explorerSlice.reducer;
