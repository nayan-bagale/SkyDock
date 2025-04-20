import userAuthApi from "@/redux/apis/userAuthApi";
import { useAppDispatch } from "@/redux/hooks";

export const useInvalidApi = () => {
  const dispatch = useAppDispatch();
  return {
    invalidUserInfo: () =>
      dispatch(userAuthApi.util.invalidateTags(["UserInfo"])),
  };
};
