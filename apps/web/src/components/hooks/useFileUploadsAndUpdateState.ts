import {
  useGetUploadUrlsMutation,
  useUploadFilesMutation,
} from "@/redux/APISlice";
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
import axios from "axios";
import { useState } from "react";

interface UploadUrlsResponse {
  [key: string]: string;
}

// Extended type with File in details
type FileTWithFile = FileT & {
  details: FileT["details"] & {
    File?: File;
  };
};

const useFileUploadsAndUpdateState = () => {
  const dispatch = useAppDispatch();

  const [getUploadUrls, { isError: isGetUploadUrlsError }] =
    useGetUploadUrlsMutation();
  const [uploadFilesDetails, { isError: isUploadFilesDetailsError }] =
    useUploadFilesMutation();

  const [error, setError] = useState<{ id: string; error: string }[] | []>([]);

  const getUploadUrlsSafely = async (
    requestFiles: { name: string; type: string; id: string }[]
  ) => {
    try {
      const uploadUrls: UploadUrlsResponse[] =
        await getUploadUrls(requestFiles).unwrap();
      return uploadUrls;
    } catch (error: any) {
      setError((prev) => [...prev, { id: "unknown", error: error.data }]);
      return null;
    }
  };

  const uploadFilesDetailsSafely = async (requestArray: FileT[]) => {
    try {
      await uploadFilesDetails(requestArray).unwrap();
      return true;
    } catch (error: any) {
      setError((prev) => [...prev, { id: "unknown", error: error.data }]);
      return null;
    }
  };

  const uploadFiles = async (files: FileTWithFile[]) => {
    const requestFiles = files.map((file) => ({
      name: file.name,
      type: file.details.type,
      id: file.id,
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
        try {
          const fileData = file.details.File;
          const fileToBeAdded = {
            ...file,
            state: { currentState: "downloding", progress: 0 },
          };
          delete fileToBeAdded.details.File;
          dispatch(addItem(fileToBeAdded));
          const response = await axios.put<void>(uploadUrl[file.id], fileData, {
            headers: {
              "Content-Type": file.details.type,
            },
            signal: controller.signal,
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 1)
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
                    currentState: "downloading",
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
          return { ...response, details: file as FileT };
        } catch (error: any) {
          setError((prev) => [
            ...prev,
            { id: file.id, error: error?.message || "Upload failed" },
          ]);
          dispatch(removeNotification(file.id));
          dispatch(deleteItem(file.id));
          return null;
        }
      })
    );
    if (!uploadFilesPromise) return null;

    // Filter out the rejected promises and get the details of the files
    // const requestArray = uploadFilesPromise
    //   .filter((promise) => {
    //     if (!promise) return false;
    //     if (promise.status === "rejected") {
    //       setError((prev) => [
    //         ...prev,
    //         {
    //           id: "unknown",
    //           error: promise ? promise.reason?.message : "undefined",
    //         },
    //       ]);
    //       return false;
    //     }
    //     return true;
    //   })
    //   .map((promise) => {
    //     if (promise.status === "fulfilled") {
    //       return promise.value?.details;
    //     }
    //   }) as FileT[];

    // Upload the details of the files to the server
    // const finalResponse = await uploadFilesDetailsSafely(requestArray);
    // if (!finalResponse) return null;

    // Update the state with the uploaded files
    // requestArray.forEach((file) => dispatch(addItem(file)));

    // requestArray.forEach((file) => dispatch(removeNotification(file.id)));

    return true;
  };

  const uploadGuestModeFiles = (files: FileTWithFile[]) => {
    files.forEach((file) =>
      dispatch(
        addItem({
          name: file.name,
          id: file.id,
          isFolder: false,
          parent: file.parent,
          details: {
            name: file.name,
            size: file.details.size,
            type: file.details.type,
            lastModified: file.details.lastModified,
          },
          state: {
            currentState: "idle",
            progress: 0,
          },
        })
      )
    );
    return true;
  };

  return [
    uploadFiles,
    uploadGuestModeFiles,
    { isErrors: error.length > 0, errors: error },
  ] as const;
};

export default useFileUploadsAndUpdateState;
