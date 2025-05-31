import { useGetAllFilesQuery } from "@/redux/apis/filesAndFolderApi";
import { useGetUserInfoQuery } from "@/redux/apis/userAuthApi";
import useTheme from "./useTheme";

const useSkydockInitialLoad = () => {
  const {
    data,
    isLoading: isLoadingUserInfo,
    isError,
  } = useGetUserInfoQuery("");
  const { isLoading: isLoadingFiles } = useGetAllFilesQuery("", {
    skip: isLoadingUserInfo || isError,
  });

  useTheme();
  // useAutoLock(10 * 60 * 1000);

  return {
    data,
    isError,
    isLoading: isLoadingUserInfo || isLoadingFiles,
  };
};

export default useSkydockInitialLoad;
