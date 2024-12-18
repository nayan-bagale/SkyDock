import {
  useGetUploadUrlsMutation,
  useUploadFilesMutation,
} from "@/redux/APISlice";
import { addItem, FileT } from "@/redux/features/explorer/explorerSlice";
import { useAppDispatch } from "@/redux/hooks";
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

    const uploadUrls = await getUploadUrlsSafely(requestFiles);

    if (!uploadUrls) return null;

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
        const response = await axios.put<void>(
          uploadUrl[file.id],
          file.details.File,
          {
            headers: {
              "Content-Type": file.details.type,
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 1)
              );
              console.log(percentCompleted);
            },
          }
        );
        delete file.details.File;
        return { ...response, details: file as FileT };
      })
    );

    if (!uploadFilesPromise) return null;

    const requestArray = uploadFilesPromise
      .filter((promise) => {
        if (!promise) return false;
        if (promise.status === "rejected") {
          setError((prev) => [
            ...prev,
            {
              id: "unknown",
              error: promise ? promise.reason?.message : "undefined",
            },
          ]);
          return false;
        }
        return true;
      })
      .map((promise) => {
        if (promise.status === "fulfilled") {
          return promise.value?.details;
        }
      }) as FileT[];

    const finalResponse = await uploadFilesDetailsSafely(requestArray);

    if (!finalResponse) return null;

    requestArray.forEach((file) => dispatch(addItem(file)));

    return true;
  };

  return [uploadFiles, { isErrors: error.length > 0, errors: error }] as const;
};

export default useFileUploadsAndUpdateState;
