import userAuthApi from "@/redux/apis/userAuthApi";
import { useAppDispatch } from "@/redux/hooks";
import { useCallback } from "react";

export const useInvalidApi = () => {
  const dispatch = useAppDispatch();
  const invalidUserInfo = useCallback(
    () => dispatch(userAuthApi.util.invalidateTags(["UserInfo"])),
    [dispatch]
  );
  return {
    invalidUserInfo,
  };
};
