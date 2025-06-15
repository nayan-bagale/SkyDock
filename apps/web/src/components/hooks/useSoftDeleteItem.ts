import {
  useDeleteFileMutation,
  useDeleteFolderMutation,
  useSoftDeleteFileAndFolderMutation,
} from "@/redux/apis/filesAndFolderApi";
import {
  deleteItem,
  moveFileIntoFolder,
} from "@/redux/features/explorer/explorerSlice";
import { useAppDispatch } from "@/redux/hooks";
import { FileT, FolderT } from "@skydock/types";
import { showToast } from "@skydock/ui/toast";
import { useContext } from "react";
import { ConfirmModalContext } from "../ContextApi/ConfirmModal";
import useDeleteFolderRecursively from "./useDeleteFolderRecursively";
import { useInvalidApi } from "./useInvalidApis";

const useSoftDeleteItem = () => {
  const [deleteFile] = useDeleteFileMutation();
  const [deleteFolder] = useDeleteFolderMutation();
  const { getNestedFolderItems, getNestedFolderItemsId } =
    useDeleteFolderRecursively();
  const [softDeleteFileAndFolder] = useSoftDeleteFileAndFolderMutation();
  const dispatch = useAppDispatch();
  const { invalidUserInfo } = useInvalidApi();
  const { open, close } = useContext(ConfirmModalContext);

  const handleDeleteItem = async (targetItem: FileT | FolderT) => {
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
      showToast("Server error occurred while deleting item", "error");
    }
  };

  const handleSoftDelete = async (targetItem: FileT | FolderT) => {
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
        showToast("Server error occurred while deleting item", "error");
      }
    } else {
      console.log("handleSoftDelete called with:", targetItem);

      open(
        "Delete Forever",
        `Are you sure you want to delete ${targetItem.name} forever? This action cannot be undone.`,
        "destructive",
        () => {
          handleDeleteItem(targetItem);
          close();
        },
        () => close()
      );
    }
  };
  return {
    handleSoftDelete,
  };
};

export default useSoftDeleteItem;
