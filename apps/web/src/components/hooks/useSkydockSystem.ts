import { useLogOutApiMutation } from "@/redux/apis/userAuthApi";
import { logOut } from "@/redux/features/auth";
import { useAppDispatch } from "@/redux/hooks";
import { showToast } from "@skydock/ui/toast";
import { useCallback } from "react";

const useSkydockSystem = () => {
  const [logOutApi] = useLogOutApiMutation();
  const dispatch = useAppDispatch();
  const signOutFunction = useCallback(() => {
    logOutApi("")
      .then(() => {
        dispatch(logOut());
      })
      .catch((error) => {
        showToast("Logout failed. Please try again.", "error");
        console.error("Logout failed:", error);
      });
  }, [dispatch, logOutApi]);

  return {
    signOutFunction,
  };
};

export default useSkydockSystem;
