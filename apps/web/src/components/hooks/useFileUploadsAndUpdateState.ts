import {
  useGetUploadUrlsMutation,
  useUploadFilesMutation,
} from "@/redux/apis/filesAndFolderApi";
import {
  addNotification,
  removeNotification,
  updateNotification,
} from "@/redux/features/control-center/controlCenterSlice";
import {
  addItem,
  deleteItem,
  updateItemState,
} from "@/redux/features/explorer/explorerSlice";
import { useAppDispatch } from "@/redux/hooks";
import { FileT } from "@skydock/types";
import { showProgressToast, showToast } from "@skydock/ui/toast";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useInvalidApi } from "./useInvalidApis";

interface UploadUrlsResponse {
  [key: string]: string;
}

// Extended type with File in details
type FileTWithFile = FileT & {
  details: FileT["details"] & {
    File?: File;
  };
};

const useFileUploadsAndUpdateState = (addItemfunc: any = addItem) => {
  const dispatch = useAppDispatch();
  const { invalidUserInfo } = useInvalidApi();

  const [getUploadUrls, { isError: isGetUploadUrlsError }] =
    useGetUploadUrlsMutation();
  const [uploadFilesDetails, { isError: isUploadFilesDetailsError }] =
    useUploadFilesMutation();

  const [error, setError] = useState<{ id: string; error: string }[] | []>([]);

  const getUploadUrlsSafely = async (
    requestFiles: { name: string; type: string; id: string; size: string }[]
  ) => {
    try {
      const uploadUrls: UploadUrlsResponse[] =
        await getUploadUrls(requestFiles).unwrap();
      return uploadUrls;
    } catch (error: any) {
      setError((prev) => [...prev, { id: "unknown", error: error.data }]);
      showToast("Failed to upload", "error");
      console.error(error);
      return null;
    }
  };

  const uploadFilesDetailsSafely = async (requestArray: FileT[]) => {
    try {
      await uploadFilesDetails(requestArray).unwrap();
      return true;
    } catch (error: any) {
      setError((prev) => [...prev, { id: "unknown", error: error.data }]);
      showToast(" Failed to upload", "error");
      return null;
    }
  };

  const uploadFiles = async (files: FileTWithFile[]) => {
    const requestFiles = files.map((file) => ({
      name: file.name,
      type: file.details.type,
      id: file.id,
      size: file.details.size,
    }));

    requestFiles.forEach((file) =>
      dispatch(
        addNotification({
          id: file.id,
          fileName: file.name,
          type: "upload",
          status: "pending",
          progress: 0,
        })
      )
    );

    // Get upload urls for each file
    const uploadUrls = await getUploadUrlsSafely(requestFiles);
    if (!uploadUrls) return null;

    // Upload each file to the corresponding url
    const uploadFilesPromise = await Promise.allSettled(
      files.map(async (file) => {
        const uploadUrl = uploadUrls.find((url) => url[file.id]);
        if (!uploadUrl) {
          setError((prev) => [
            ...prev,
            { id: file.id, error: "Upload failed" },
          ]);
          return;
        }
        const controller = new AbortController();
        const toastId = showProgressToast({
          status: "loading",
          fileName: file.name,
          progress: 0,
        });

        try {
          const fileData = file.details.File;
          const fileToBeAdded = {
            ...file,
            state: { currentState: "uploding", progress: 0 },
          };
          delete fileToBeAdded.details.File;
          dispatch(addItemfunc(fileToBeAdded));

          const response = await axios.put<void>(uploadUrl[file.id], fileData, {
            headers: {
              "Content-Type": file.details.type,
            },
            signal: controller.signal,
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 1)
              );
              showProgressToast(
                {
                  status: "loading",
                  fileName: file.name,
                  progress: percentCompleted,
                  abort: () => controller.abort(),
                },
                {
                  id: toastId,
                }
              );

              dispatch(
                updateNotification({
                  id: file.id,
                  progress: percentCompleted,
                  cancelUpload: () => controller.abort(),
                })
              );
              dispatch(
                updateItemState({
                  id: file.id,
                  state: {
                    currentState: "uploding",
                    progress: percentCompleted,
                  },
                })
              );
            },
          });
          delete file.details.File;
          await uploadFilesDetailsSafely([file]);
          // dispatch(addItem(file));
          dispatch(removeNotification(file.id));
          dispatch(
            updateItemState({
              id: file.id,
              state: {
                currentState: "idle",
                progress: 0,
              },
            })
          );
          showProgressToast(
            {
              status: "success",
              progress: 100,
              fileName: file.name,
            },
            {
              id: toastId,
            }
          );
          return { ...response, details: file as FileT };
        } catch (error: any) {
          showProgressToast(
            {
              status: "error",
              progress: 0,
              fileName: file.name,
            },
            {
              id: toastId,
            }
          );
          setError((prev) => [
            ...prev,
            { id: file.id, error: error?.message || "Upload failed" },
          ]);
          dispatch(removeNotification(file.id));
          dispatch(deleteItem(file));
          return null;
        } finally {
          setTimeout(() => {
            toast.dismiss(toastId);
          }, 2000);
        }
      })
    );
    if (!uploadFilesPromise) return null;

    invalidUserInfo();

    return uploadFilesPromise
      .filter((result) => result.status === "fulfilled")
      .map((result) => {
        return (result as PromiseFulfilledResult<{ details: FileT }>).value
          .details;
      });
  };

  return [uploadFiles, { isErrors: error.length > 0, errors: error }] as const;
};

export default useFileUploadsAndUpdateState;
