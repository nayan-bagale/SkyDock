import {
  useCreateFolderMutation,
  useUpdateItemMutation,
} from "@/redux/apis/filesAndFolderApi";
import { closeContextMenu } from "@/redux/features/contextMenu/contextMenuSlice";
import {
  addItem,
  clearClipboard,
  cutToClipboard,
  moveFileIntoFolder,
  openExplorer,
  setCurrentFolder,
  setCurrentFolderAndCurrentTab,
  setExplorerFileActionModalOn,
} from "@/redux/features/explorer/explorerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { nanoid } from "@reduxjs/toolkit";
import { FileT, FolderT } from "@skydock/types";
import {
  FILE_EXTENSIONS_TO_MIME_TYPES,
  FileExtensions,
} from "@skydock/types/enums";
import { showToast } from "@skydock/ui/toast";
import { useCallback, useContext } from "react";
import { FileSaveAndOpenModalContext } from "../ContextApi/FileSaveAndOpenModal";
import useAppOpenBasedOnFileType from "./useAppOpenBasedOnFileType";
import useEmptyFileGenerator from "./useEmptyFileGenerator";
import useFileDownloadWithProgress from "./useFileDownloadWithProgress";
import useSoftDeleteItem from "./useSoftDeleteItem";

const useContextMenu = (targetItem: FileT | FolderT | null) => {
  const explorerItems = useAppSelector((state) => state.explorer.explorerItems);
  const isExplorerOn = useAppSelector(
    (state) => state.explorer.actions.isProcessOn
  );
  const clipboardItems = useAppSelector((state) => state.explorer.clipboard);
  const activeTab = useAppSelector((state) => state.explorer.activeTab);
  const explorerLastPosition = useAppSelector(
    (state) => state.explorer.actions.lastPosition
  );
  const { openApp } = useAppOpenBasedOnFileType(targetItem);

  const [createFolder] = useCreateFolderMutation();
  const [updateFileApi] = useUpdateItemMutation();
  const dispatch = useAppDispatch();
  const { downloadFile } = useFileDownloadWithProgress();
  const { generateEmptyFile } = useEmptyFileGenerator();
  const { handleSoftDelete } = useSoftDeleteItem();
  const { restoreFileModal } = useContext(FileSaveAndOpenModalContext);

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
      await createFolder(folderObj).unwrap();
      dispatch(addItem(folderObj));
      dispatch(closeContextMenu());
    } catch (error) {
      showToast("Error creating folder", "error");
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

    await handleSoftDelete(targetItem);

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
          try {
            await updateFileApi({
              id: itemId,
              parent_id: currentFolder.id,
            }).unwrap();
            dispatch(
              moveFileIntoFolder({ fileId: itemId, folderId: currentFolder.id })
            );
          } catch (error) {
            showToast("Error occurred while moving the file", "error");
            console.error("Error moving file:", error);
          }
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
    let newFileName = number === 0 ? "untitled" : `untitled ${number}`;
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
    async (currentFolder: FolderT, extension: keyof typeof FileExtensions) => {
      const mimeType = FILE_EXTENSIONS_TO_MIME_TYPES[extension];
      const filteredItems = Object.values(explorerItems).filter((item) => {
        return (
          item.isFolder === false &&
          item.parent === currentFolder.id &&
          item.details.type === mimeType
        );
      });

      const fileName = fileNameGenerator(extension, filteredItems.length);

      try {
        await generateEmptyFile({
          mimeType: extension,
          fileName,
          folderId: currentFolder.id,
        });
      } catch (error) {
        console.error("Error generating empty file:", error);
      }
      dispatch(closeContextMenu());
    },
    [dispatch, explorerItems, generateEmptyFile]
  );

  const handleRestoreFile = async () => {
    if (!targetItem) return;
    dispatch(closeContextMenu());
    dispatch(setExplorerFileActionModalOn(true));
    restoreFileModal({
      appName: "Explorer",
      onSuccess: async (item) => {
        try {
          await updateFileApi({
            id: targetItem.id,
            parent_id: item.id,
          }).unwrap();
          dispatch(
            moveFileIntoFolder({ fileId: targetItem.id, folderId: item.id })
          );
        } catch (error) {
          showToast("Error occurred while restoring the file", "error");
        } finally {
          dispatch(setExplorerFileActionModalOn(false));
        }
      },
      onClose: () => {
        dispatch(setExplorerFileActionModalOn(false));
      },
      lastPosition: explorerLastPosition,
    });
  };

  return {
    handleAddFolder,
    handleOpen,
    handleDelete,
    handleDownload,
    handleCut,
    handlePaste,
    handleGenerateEmptyFile,
    handleRestoreFile,
  };
};

export default useContextMenu;
