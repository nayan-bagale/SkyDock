import { useAppSelector } from "@/redux/hooks";
import { FileT, FolderT } from "@skydock/types";
import { useCallback } from "react";

const useDeleteFolderRecursively = () => {
  const items = useAppSelector((state) => state.explorer.explorerItems);

  const getNestedFolderItemsId = useCallback(
    (itemId: string, arr: string[] = []): string[] => {
      const folder = items[itemId];
      if (!folder.isFolder) {
        arr.push(itemId);
        return arr;
      }

      for (const child of folder.children) {
        if (items[child].isFolder) {
          getNestedFolderItemsId(child, arr); // recurse without returning early
        } else {
          arr.push(child);
        }
      }

      arr.push(itemId);

      return arr;
    },
    [items]
  );

  const getNestedFolderItems = useCallback(
    (itemId: string, arr: (FileT | FolderT)[] = []): (FileT | FolderT)[] => {
      const folder = items[itemId];
      if (!folder.isFolder) {
        arr.push(folder);
        return arr;
      }

      for (const child of folder.children) {
        if (items[child].isFolder) {
          getNestedFolderItems(child, arr); // recurse without returning early
        } else {
          arr.push(items[child]);
        }
      }

      arr.push(items[itemId]);

      return arr;
    },
    [items]
  );

  return { getNestedFolderItemsId, getNestedFolderItems };
};

export default useDeleteFolderRecursively;
