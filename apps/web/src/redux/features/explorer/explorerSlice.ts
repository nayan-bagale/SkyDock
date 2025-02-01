import { X_POSITION, Y_POSITION } from "@/constants";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExplorerT, FileT, FolderT } from "@skydock/types";

const initalState = {
  explorerItems: {
    root: {
      id: "root",
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
    // file1: {
    //   id: "file1",
    //   isFolder: false,
    //   name: "file1.txt",
    //   parent: "root",
    //   details: {
    //     name: "file1.txt",
    //     size: "15KB",
    //     type: "text/plain",
    //     lastModified: "2023-10-01T12:00:00Z",
    //     // File: new File(["content"], "file1.txt", { type: "text/plain" }),
    //   },
    // },
    // folder1: {
    //   id: "folder1",
    //   isFolder: true,
    //   name: "folder1",
    //   parent: "root",
    //   details: {
    //     size: 0,
    //     lastModified: "2023-10-02T12:00:00Z",
    //   },
    //   children: ["file2"],
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
  currentFolder: "root",
  backStack: [],
  forwardStack: [],
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
    addItem: (state, action) => {
      const currentFolderItem = state.explorerItems[state.currentFolder];
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

      const currentFolderItem = state.explorerItems[state.currentFolder];
      if (currentFolderItem.isFolder) {
        state.explorerItems = {
          ...state.explorerItems,
          [state.currentFolder]: {
            ...currentFolderItem,
            children: currentFolderItem.children.filter(
              (child) => child !== action.payload
            ),
          },
        };
        deleteRecursively(action.payload);
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
    setForwardStack: (state) => {
      const temp = state.forwardStack.pop();
      if (temp) state.backStack.push(temp);
      state.currentFolder =
        state.forwardStack[state.forwardStack.length - 1] || "root";
    },
    setBackStack: (state) => {
      const temp = state.backStack.pop();
      if (temp) state.currentFolder = temp;
    },
    setBreadCrumb: (state, action) => {
      state.currentFolder = action.payload;
      const index = state.backStack.indexOf(action.payload);
      if (index !== -1) {
        state.backStack = state.backStack.slice(0, index);
      }
    },

    changeView: (state, action) => {
      state.settings.view = action.payload;
    },

    explorerProcess: (state, action) => {
      state.currentFolder = "root";
      state.backStack = [];
      state.forwardStack = [];
      state.actions.isProcessOn = action.payload;
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
  setCurrentFolder,
  setForwardStack,
  setBackStack,
  setBreadCrumb,
  deleteItem,
  renameItem,
  moveFileIntoFolder,
  changeView,
  explorerProcess,
  changeExplorerSize,
  changeExplorerMinimized,
  changeExplorerLastSize,
  setItemDragged,
} = explorerSlice.actions;

export default explorerSlice.reducer;
