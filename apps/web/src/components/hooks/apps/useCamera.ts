import { HandleError } from "@/errors/rtkQueryError";
import { setCameraPermission } from "@/redux/features/skydock/skydockSlice";
import { useAppDispatch } from "@/redux/hooks";
import { BrowserApis, BrowserApisErrors } from "@skydock/types/enums";
import { useCallback, useRef, useState } from "react";
import { useLocalStorage } from "react-use";

const useCamera = () => {
  const [error, setError] = useState<string | null>(null);
  const activeStream = useRef<HTMLVideoElement | null>(null);
  const dispatch = useAppDispatch();
  const [value, setValue] =
    useLocalStorage<BrowserApis["camera"]["permission"]>("cameraPermission");

  const start = useCallback(async () => {
    try {
      if (activeStream.current && !activeStream.current.srcObject) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        activeStream.current.srcObject = mediaStream;
      }
      setError(null);
      dispatch(setCameraPermission("Allowed"));
      setValue("Allowed");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        if (
          err.message
            .toLowerCase()
            .includes(BrowserApisErrors.CAMERA_PERMISSION_DENIED.toLowerCase())
        ) {
          dispatch(setCameraPermission("Denied"));
          setValue("Denied");
        } else if (
          err.message
            .toLowerCase()
            .includes(
              BrowserApisErrors.CAMERA_PERMISSION_DISMISSED.toLowerCase()
            )
        ) {
          dispatch(setCameraPermission("Prompt"));
          setValue("Prompt");
        } else {
          setError("Could not access camera");
        }
      }
      console.log(err);
      HandleError(err);
    }
  }, [dispatch, setValue]);

  const stop = useCallback(() => {
    if (activeStream.current && activeStream.current.srcObject) {
      const mediaStream = activeStream.current.srcObject as MediaStream;
      mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
      activeStream.current.srcObject = null;
      activeStream.current = null;
    }
  }, [activeStream]);

  return { error, start, stop, streamRef: activeStream };
};

export default useCamera;
