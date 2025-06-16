import { FileSaveAndOpenModalContext } from "@/components/ContextApi/FileSaveAndOpenModal";
import { useGetFileUrlMutation } from "@/redux/apis/filesAndFolderApi";
import {
  openImageViewer,
  setImageFileActionModalOn,
  setImageUrl,
} from "@/redux/features/imageViewer/imageViewerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fileIdGenerator } from "@/utils";
import { FileT } from "@skydock/types";
import { AppsT, SupportedMimeTypes } from "@skydock/types/enums";
import { showToast } from "@skydock/ui/toast";
import { useCallback, useContext, useState } from "react";
import useFileDownloadWithProgress from "../useFileDownloadWithProgress";

const useImageViewer = () => {
  const dispatch = useAppDispatch();
  const imageUrl = useAppSelector(
    (state) => state.imageViewer.imageViewerInfo.imageUrl
  );
  const imageFileInfo = useAppSelector(
    (state) => state.imageViewer.imageViewerInfo.imageFileInfo
  );
  const lastPosition = useAppSelector(
    (state) => state.imageViewer.actions.lastPosition
  );

  const { openFileOpenerModal } = useContext(FileSaveAndOpenModalContext);
  const { downloadFile } = useFileDownloadWithProgress();

  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const [getFileUrl] = useGetFileUrlMutation();

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.1, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  }, []);

  const handleRotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const handleReset = useCallback(() => {
    setZoom(1);
    setRotation(0);
  }, []);

  const openImageFile = useCallback(
    async (item: FileT | null) => {
      if (item) {
        try {
          const { url } = await getFileUrl(fileIdGenerator(item)).unwrap();
          dispatch(setImageUrl(url));
          dispatch(openImageViewer(item));
        } catch (error) {
          console.error("Error fetching image URL:", error);
          showToast("Error loading image", "error");
        }
      }
    },
    [dispatch, getFileUrl]
  );

  const openImageFileUsingModal = useCallback(() => {
    dispatch(setImageFileActionModalOn(true));
    openFileOpenerModal({
      appName: AppsT.ImageViewer,
      onSuccess: async (file) => {
        await openImageFile(file as FileT);
      },
      onClose: () => {
        dispatch(setImageFileActionModalOn(false));
      },
      supportedMimeTypes: [SupportedMimeTypes.Image],
      lastPosition,
    });
  }, [dispatch, lastPosition, openFileOpenerModal, openImageFile]);

  const download = useCallback(async () => {
    if (!imageFileInfo) {
      showToast("No file selected to download", "error");
      return;
    }
    return await downloadFile(imageFileInfo);
  }, [downloadFile, imageFileInfo]);

  return {
    imageUrl,
    imageFileInfo,
    zoom,
    rotation,
    handleZoomIn,
    handleZoomOut,
    handleRotate,
    handleReset,
    openImageFile,
    openImageFileUsingModal,
    download,
  };
};

export default useImageViewer;
