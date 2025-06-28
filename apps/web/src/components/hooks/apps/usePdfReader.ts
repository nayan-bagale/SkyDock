import { FileSaveAndOpenModalContext } from "@/components/ContextApi/FileSaveAndOpenModal";
import { useGetFileUrlMutation } from "@/redux/apis/filesAndFolderApi";
import {
  closePdfReader,
  openPdfReader,
  setPdfFileActionModalOn,
  setPdfUrl,
} from "@/redux/features/pdf-reader/pdfReaderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { FileT } from "@skydock/types";
import { AppsT, SupportedMimeTypes } from "@skydock/types/enums";
import { showToast } from "@skydock/ui/toast";
import { useCallback, useContext, useState } from "react";
import useFileDownloadWithProgress from "../useFileDownloadWithProgress";

const usePdfReader = () => {
  const dispatch = useAppDispatch();
  const pdfUrl = useAppSelector(
    (state) => state.pdfReader.pdfReaderInfo.pdfUrl
  );
  const pdfFileInfo = useAppSelector(
    (state) => state.pdfReader.pdfReaderInfo.pdfFileInfo
  );
  const lastPosition = useAppSelector(
    (state) => state.pdfReader.actions.lastPosition
  );

  const { openFileOpenerModal } = useContext(FileSaveAndOpenModalContext);
  const { downloadFile } = useFileDownloadWithProgress();
  const [getFileUrl] = useGetFileUrlMutation();

  const [numPages, setNumPages] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }): void => {
      setNumPages(numPages);
      setIsLoading(false);
    },
    []
  );

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error("Error loading PDF:", error);
    setIsLoading(false);
    showToast("Error loading PDF document", "error");
  }, []);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.2, 3.0));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  }, []);

  const handleResetZoom = useCallback(() => {
    setScale(1.0);
  }, []);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= numPages) {
        setPageNumber(page);

        const pageElement = document.getElementById(`page-${page}`);
        if (pageElement) {
          pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    },
    [numPages]
  );

  const openPdfFile = useCallback(
    async (item: FileT | null) => {
      if (item) {
        try {
          const { url } = await getFileUrl(
            `${item.id}.${item.name.split(".").pop()}`
          ).unwrap();
          dispatch(setPdfUrl(url));
          dispatch(openPdfReader(item));
        } catch (error) {
          showToast("Failed to open PDF file.", "error");
        }
      }
    },
    [dispatch, getFileUrl]
  );

  const openPdfFileUsingModal = useCallback(() => {
    dispatch(setPdfFileActionModalOn(true));
    openFileOpenerModal({
      appName: AppsT.PdfReader,
      onSuccess: async (file) => {
        await openPdfFile(file as FileT);
      },
      onClose: () => {
        dispatch(setPdfFileActionModalOn(false));
      },
      supportedMimeTypes: [SupportedMimeTypes.PDF],
      lastPosition,
    });
  }, [dispatch, lastPosition, openFileOpenerModal, openPdfFile]);

  const download = useCallback(async () => {
    if (!pdfFileInfo) {
      showToast("No PDF file to download.", "error");
      return;
    }
    return await downloadFile(pdfFileInfo);
  }, [downloadFile, pdfFileInfo]);

  const close = useCallback(() => {
    dispatch(closePdfReader());
  }, [dispatch]);

  return {
    pdfUrl,
    pdfFileInfo,
    numPages,
    onDocumentLoadSuccess,
    onDocumentLoadError,
    scale,
    isLoading,
    openPdfFile,
    openPdfFileUsingModal,
    download,
    close,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    pageNumber,
    goToPage,
  };
};

export default usePdfReader;
