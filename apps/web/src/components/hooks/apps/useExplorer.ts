import { useCreateFolderMutation } from "@/redux/apis/filesAndFolderApi";
import { addItem } from "@/redux/features/explorer/explorerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { nanoid } from "@reduxjs/toolkit";
import { FolderT } from "@skydock/types";

const useExplorer = () => {
  const dispatch = useAppDispatch();
  const [createFolder] = useCreateFolderMutation();
  const explorerItems = useAppSelector((state) => state.explorer.explorerItems);

  const addFolder = async (currentFolderId: string) => {
    // Get all folders in current directory
    if (!currentFolderId) {
      console.error("Current folder not found");
      return;
    }
    const currentFolder = explorerItems[currentFolderId] as FolderT;
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

    await createFolder(folderObj);
    dispatch(addItem(folderObj));
  };

  return {
    addFolder,
  };
};

export default useExplorer;
