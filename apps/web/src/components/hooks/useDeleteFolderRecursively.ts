import { useAppSelector } from "@/redux/hooks";
import { useCallback } from "react";

const useDeleteFolderRecursively = () => {
  const items = useAppSelector((state) => state.explorer.explorerItems);

  const deleteFolderRecursively = useCallback(
    (itemId: string, arr: string[] = []): string[] => {
      const folder = items[itemId];
      if (!folder.isFolder) {
        arr.push(itemId);
        return arr;
      }

      for (const child of folder.children) {
        if (items[child].isFolder) {
          deleteFolderRecursively(child, arr); // recurse without returning early
        } else {
          arr.push(child);
        }
      }

      arr.push(itemId);

      return arr;
    },
    [items]
  );

  return [deleteFolderRecursively];
};

export default useDeleteFolderRecursively;
