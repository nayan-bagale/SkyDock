import {
  useCreateFolderMutation,
  useDeleteFileMutation,
  useDeleteFolderMutation,
  useUpdateItemMutation,
} from "@/redux/APISlice";
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
import useDeleteFolderRecursively from "./useDeleteFolderRecursively";
import useFileDownloadWithProgress from "./useFileDownloadWithProgress";

const useContextMenu = (targetItem: FileT | FolderT | null) => {
  const explorerItems = useAppSelector((state) => state.explorer.explorerItems);
  const isExplorerOn = useAppSelector(
    (state) => state.explorer.actions.isProcessOn
  );
  const clipboardItems = useAppSelector((state) => state.explorer.clipboard);

  const [createFolder] = useCreateFolderMutation();
  const [deleteFile] = useDeleteFileMutation();
  const [deleteFolder] = useDeleteFolderMutation();
  const [updateFileApi] = useUpdateItemMutation();

  const dispatch = useAppDispatch();
  const [getNestedFolderItemsId] = useDeleteFolderRecursively();
  const { downloadFile } = useFileDownloadWithProgress();

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
    folder: "explorer" | "desktop"
  ) => {
    if (!targetItem || !targetItem.isFolder) return;
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
    dispatch(closeContextMenu());
  };

  const handleDelete = async () => {
    if (!targetItem) return;

    try {
      if (targetItem.isFolder) {
        const arrayItems = getNestedFolderItemsId(targetItem.id, []);
        console.log(arrayItems);
        await deleteFolder(arrayItems);
      } else {
        await deleteFile(targetItem.id);
      }
      dispatch(deleteItem(targetItem));
    } catch (error) {
      console.log(error);
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

  return {
    handleAddFolder,
    handleOpen,
    handleDelete,
    handleDownload,
    handleCut,
    handlePaste,
  };
};

export default useContextMenu;
