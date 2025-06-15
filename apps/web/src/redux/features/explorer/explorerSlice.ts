import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExplorerT, FileT, FolderT } from "@skydock/types";
import { ExplorerTabs } from "@skydock/types/enums";
import { initialState } from "./intialState";

export const explorerSlice = createSlice({
  name: "explorer",
  initialState,
  reducers: {
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

    addItemToFolder: (state, action: PayloadAction<FileT>) => {
      const file = action.payload;
      const folderItem = state.explorerItems[file.parent] as FolderT;

      if (folderItem.isFolder) {
        state.explorerItems = {
          ...state.explorerItems,
          [file.parent]: {
            ...folderItem,
            children: [...folderItem.children, file.id],
          },
          [file.id]: {
            ...file,
            parent: file.parent,
            isDeleted: false,
            deletedAt: null,
          },
        };
      }
    },

    initializeItems: (state, action) => {
      const drives: ExplorerT["activeTab"][] = [...ExplorerTabs];
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
        state.explorerItems = {
          ...state.explorerItems,
          [action.payload.id]: action.payload,
        };
      }
    },

    deleteItem: (state, action: PayloadAction<FolderT | FileT>) => {
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

    emptyTrash: (state) => {
      const deleteRecursively = (itemId: FolderT["id"]) => {
        const item = state.explorerItems[itemId];
        if (item.isFolder) {
          item.children.forEach((childId) => {
            deleteRecursively(childId);
          });
        }
        delete state.explorerItems[itemId];
      };
      const trashFolder = state.explorerItems["trash"];
      if (trashFolder.isFolder) {
        trashFolder.children.forEach((childId) => {
          deleteRecursively(childId);
        });
        trashFolder.children = [];
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
          isDeleted: folderItem.id === "trash" ? true : false,
          deletedAt:
            folderItem.id === "trash" ? new Date().toDateString() : null,
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
      state.activeTab = "skydrive";
      state.backStack = [];
      state.forwardStack = [];
      state.actions.isProcessOn = action.payload;
    },

    openExplorer: (state) => {
      state.actions.isProcessOn = true;
    },

    openTrash: (state) => {
      state.activeTab = "trash";
      state.currentFolder = "trash";
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

    setExplorerLastPosition: (
      state,
      action: PayloadAction<{ x: number; y: number }>
    ) => {
      state.actions.lastPosition = action.payload;
    },

    setItemDragged: (state, action) => {
      state.itemDragged = action.payload;
    },

    copyToClipboard: (state, action: PayloadAction<string[]>) => {
      state.clipboard.items = action.payload;
      state.clipboard.operation = "copy";
      // state.clipboard.sourceFolder = state.currentFolder;
    },

    cutToClipboard: (state, action: PayloadAction<string[]>) => {
      state.clipboard.items = action.payload;
      state.clipboard.operation = "cut";
      // state.clipboard.sourceFolder = state.currentFolder;
    },

    clearClipboard: (state) => {
      state.clipboard.items = [];
      state.clipboard.operation = null;
      // state.clipboard.sourceFolder = null;
    },

    pasteFromClipboard: (state, action: PayloadAction<string>) => {
      // This will be handled in a thunk action
      // The actual paste logic is complex and requires API calls
    },

    setExplorerLoading: (state, action: PayloadAction<boolean>) => {
      state.state.isLoading = action.payload;
    },

    setExplorerFileActionModalOn: (state, action: PayloadAction<boolean>) => {
      state.actions.isFileActionModalOn = action.payload;
    },
  },
});

export const {
  initializeItems,
  addItem,
  setCurrentFolder,
  setCurrentFolderAndCurrentTab,
  setForwardStack,
  setBackStack,
  setBreadCrumb,
  deleteItem,
  emptyTrash,
  renameItem,
  updateItemState,
  moveFileIntoFolder,
  changeView,
  explorerProcess,
  openTrash,
  openExplorer,
  changeExplorerSize,
  changeExplorerMinimized,
  changeExplorerLastSize,
  setExplorerLastPosition,
  setItemDragged,
  setActiveTab,
  copyToClipboard,
  cutToClipboard,
  clearClipboard,
  pasteFromClipboard,
  setExplorerLoading,
  addItemToFolder,
  setExplorerFileActionModalOn,
} = explorerSlice.actions;

export default explorerSlice.reducer;
