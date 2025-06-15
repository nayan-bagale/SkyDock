import {
  useCreateFolderMutation,
  useDeleteFileMutation,
  useDeleteFolderMutation,
  useSoftDeleteFileAndFolderMutation,
  useUpdateItemMutation,
} from "@/redux/apis/filesAndFolderApi";
import { closeContextMenu } from "@/redux/features/contextMenu/contextMenuSlice";
import {
  addItem,
  clearClipboard,
  cutToClipboard,
  deleteItem,
  moveFileIntoFolder,
  openExplorer,
  setCurrentFolder,
  setCurrentFolderAndCurrentTab,
} from "@/redux/features/explorer/explorerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { nanoid } from "@reduxjs/toolkit";
import { FileT, FolderT } from "@skydock/types";
import { FileExtensions } from "@skydock/types/enums";
import { useCallback } from "react";
import useAppOpenBasedOnFileType from "./useAppOpenBasedOnFileType";
import useDeleteFolderRecursively from "./useDeleteFolderRecursively";
import useEmptyFileGenerator from "./useEmptyFileGenerator";
import useFileDownloadWithProgress from "./useFileDownloadWithProgress";
import { useInvalidApi } from "./useInvalidApis";

const useContextMenu = (targetItem: FileT | FolderT | null) => {
  const explorerItems = useAppSelector((state) => state.explorer.explorerItems);
  const isExplorerOn = useAppSelector(
    (state) => state.explorer.actions.isProcessOn
  );
  const clipboardItems = useAppSelector((state) => state.explorer.clipboard);
  const activeTab = useAppSelector((state) => state.explorer.activeTab);
  const { openApp } = useAppOpenBasedOnFileType(targetItem);

  const [createFolder] = useCreateFolderMutation();
  const [deleteFile] = useDeleteFileMutation();
  const [deleteFolder] = useDeleteFolderMutation();
  const [updateFileApi] = useUpdateItemMutation();
  const [softDeleteFileAndFolder] = useSoftDeleteFileAndFolderMutation();
  const { invalidUserInfo } = useInvalidApi();

  const dispatch = useAppDispatch();
  const { getNestedFolderItems, getNestedFolderItemsId } =
    useDeleteFolderRecursively();
  const { downloadFile } = useFileDownloadWithProgress();
  const { generateEmptyFile } = useEmptyFileGenerator();

  const handleAddFolder = async (currentFolder: FolderT) => {
    // Get all folders in current directory
    const currentFolderChildren = currentFolder.children;
    const existingFolders = Object.values(explorerItems).filter((item) =>
      currentFolderChildren.includes(item.id)
    );

    // Generate new folder name
    let newFolderName = "New Folder";
    let counter = 1;

    while (existingFolders.some((folder) => folder.name === newFolderName)) {
      newFolderName = `New Folder (${counter})`;
      counter++;
    }

    const folderObj = {
      id: nanoid(),
      isFolder: true,
      name: newFolderName,
      parent: currentFolder.id,
      details: {
        size: 0,
        lastModified: new Date().toISOString(),
      },
      children: [],
    };

    try {
      await createFolder(folderObj);
      dispatch(addItem(folderObj));
      dispatch(closeContextMenu());
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const handleOpen = (
    targetItem: FileT | FolderT | null,
    folder?: "explorer" | "desktop"
  ) => {
    if (!targetItem) return;
    if (targetItem.isFolder) {
      if (folder === "desktop") {
        if (!isExplorerOn) {
          dispatch(openExplorer());
        }
        dispatch(
          setCurrentFolderAndCurrentTab({
            currentFolder: targetItem.id,
            activeTab: folder,
          })
        );
      } else {
        dispatch(setCurrentFolder(targetItem.id));
      }
    } else {
      openApp();
    }
    dispatch(closeContextMenu());
  };

  const handleDelete = async () => {
    if (!targetItem) return;

    if (targetItem.parent !== "trash") {
      const arrayItems = getNestedFolderItems(targetItem.id, []).map((item) => {
        if (targetItem.id === item.id) {
          return {
            ...item,
            parent: "trash",
          };
        }
        return item;
      });
      try {
        console.log(arrayItems);
        await softDeleteFileAndFolder(arrayItems);
        dispatch(
          moveFileIntoFolder({ fileId: targetItem.id, folderId: "trash" })
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        if (targetItem.isFolder) {
          const arrayItems = getNestedFolderItemsId(targetItem.id, []);
          await deleteFolder(arrayItems);
        } else {
          await deleteFile(targetItem.id);
        }
        invalidUserInfo();
        dispatch(deleteItem(targetItem));
      } catch (error) {
        console.log(error);
      }
    }

    dispatch(closeContextMenu());
  };

  const handleDownload = async () => {
    if (targetItem && !targetItem.isFolder) {
      await downloadFile(targetItem);
    }
    dispatch(closeContextMenu());
  };

  const handleCut = () => {
    if (!targetItem) return;
    dispatch(cutToClipboard([targetItem.id]));
    dispatch(closeContextMenu());
  };

  const handlePaste = (currentFolder: FolderT) => {
    if (clipboardItems.operation === "cut") {
      clipboardItems.items.forEach(async (itemId) => {
        if (!currentFolder.children.includes(itemId)) {
          await updateFileApi({
            id: itemId,
            parent_id: currentFolder.id,
          });
          dispatch(
            moveFileIntoFolder({ fileId: itemId, folderId: currentFolder.id })
          );
        }
      });
    }

    dispatch(clearClipboard());
    dispatch(closeContextMenu());
  };

  const fileNameGenerator = (
    mimeType: keyof typeof FileExtensions,
    number: number
  ) => {
    let newFileName = number < 0 ? "untitled" : `untitled ${number}`;
    switch (mimeType) {
      case FileExtensions.txt:
        newFileName += ".txt";
        break;
      // Add more cases for other mime types if needed
      default:
        newFileName += `.${mimeType.split("/")[1]}`;
    }
    return newFileName;
  };

  const handleGenerateEmptyFile = useCallback(
    async (currentFolder: FolderT, mimeType: keyof typeof FileExtensions) => {
      const filteredItems = Object.values(explorerItems).filter((item) => {
        return (
          item.isFolder === false &&
          item.parent === currentFolder.id &&
          item.details.type === mimeType
        );
      });

      const fileName = fileNameGenerator(mimeType, filteredItems.length);

      try {
        await generateEmptyFile({
          mimeType,
          fileName,
          folderId: currentFolder.id,
        });
      } catch (error) {
        console.error("Error generating empty file:", error);
      }
    },
    [explorerItems, generateEmptyFile]
  );

  return {
    handleAddFolder,
    handleOpen,
    handleDelete,
    handleDownload,
    handleCut,
    handlePaste,
    handleGenerateEmptyFile,
  };
};

export default useContextMenu;
