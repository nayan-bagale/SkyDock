import { useGetAllFilesQuery } from "@/redux/apis/filesAndFolderApi";
import { useGetUserInfoQuery } from "@/redux/apis/userAuthApi";
import useTheme from "./useTheme";

const useSkydockInitialLoad = () => {
  const { data, isLoading, isError } = useGetUserInfoQuery("");
  useGetAllFilesQuery("", {
    skip: isLoading || isError,
  });

  useTheme();
  // useAutoLock(10 * 60 * 1000);

  return {
    data,
    isError,
    isLoading,
  };
};

export default useSkydockInitialLoad;
