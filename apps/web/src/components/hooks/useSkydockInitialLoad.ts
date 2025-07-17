import { useGetAllFilesQuery } from "@/redux/apis/filesAndFolderApi";
import { useGetUserInfoQuery } from "@/redux/apis/userAuthApi";
import { setCameraPermission } from "@/redux/features/skydock/skydockSlice";
import { useAppDispatch } from "@/redux/hooks";
import { BrowserApis } from "@skydock/types/enums";
import { useEffect } from "react";
import { useLocalStorage } from "react-use";
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
  const dispatch = useAppDispatch();
  const [value] =
    useLocalStorage<BrowserApis["camera"]["permission"]>("cameraPermission");

  useEffect(() => {
    dispatch(setCameraPermission(value));
  }, []);

  useTheme();
  // useAutoLock(10 * 60 * 1000);

  return {
    data,
    isError,
    isLoading: isLoadingUserInfo || isLoadingFiles,
  };
};

export default useSkydockInitialLoad;
