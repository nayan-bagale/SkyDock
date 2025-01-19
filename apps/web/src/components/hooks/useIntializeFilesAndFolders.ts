import { useGetAllFilesQuery } from "@/redux/APISlice";
import { addItem } from "@/redux/features/explorer/explorerSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect } from "react";

const useIntializeFilesAndFolders = () => {
  const { data, isError } = useGetAllFilesQuery("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!data) {
      console.log("Error in fetching files and folders");
      return;
    }
    const filesObj = data.map((file) => ({
      id: file.id,
      isFolder: file.is_folder,
      name: file.name,
      parent: file.parent_id,
      details: {
        name: file.name,
        size: file.size,
        type: file.mime_type,
        lastModified: file.last_modified,
      },
    }));

    filesObj.forEach((file) => dispatch(addItem(file)));
  }, [data]);
};

export default useIntializeFilesAndFolders;
