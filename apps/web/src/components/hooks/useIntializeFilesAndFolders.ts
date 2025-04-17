import { useGetAllFilesQuery } from "@/redux/apis/filesAndFolderApi";
import { initializeItems } from "@/redux/features/explorer/explorerSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect } from "react";

const useIntializeFilesAndFolders = ({ skip }: { skip: boolean }) => {
  const { data, isError, refetch } = useGetAllFilesQuery("", { skip });
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!data) {
      // console.log("Error in fetching files and folders");
      return;
    }
    // TODO: Handle items on desktop
    const itemsObj = data.map((item) => {
      if (item.is_folder) {
        return {
          id: item.id,
          isFolder: item.is_folder,
          name: item.name,
          parent: item.parent_id,
          details: {
            size: item.size,
            lastModified: item.last_modified,
          },
          children:
            data
              .filter((child) => child.parent_id === item.id)
              .map((child) => child.id) ?? [],
        };
      } else {
        return {
          id: item.id,
          isFolder: item.is_folder,
          name: item.name,
          parent: item.parent_id,
          details: {
            name: item.name,
            size: item.size,
            type: item.mime_type,
            lastModified: item.last_modified,
          },
        };
      }
    });

    itemsObj.forEach((item) => dispatch(initializeItems(item)));
  }, [data]);
};

export default useIntializeFilesAndFolders;
