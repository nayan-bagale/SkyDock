import { FileSaveAndOpenModalContext } from "@/components/ContextApi/FileSaveAndOpenModal";
import { RESPONSE_DELAY } from "@/constants";
import { HandleError } from "@/errors/rtkQueryError";
import {
  useGetTextFileContentMutation,
  useUpdateTextFileContentMutation,
} from "@/redux/apis/filesAndFolderApi";
import { addItemToFolder } from "@/redux/features/explorer/explorerSlice";
import {
  closeNotePad,
  openNotePad,
  openNotePadFileActionModal,
  setNotePadContent,
  setNotePadLastSaved,
  setNotePadSyncStatus,
} from "@/redux/features/note-pad/notePadSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fileArrayGenerator } from "@/utils/file-array-generator";
import sleep from "@/utils/sleep";
import { FileT } from "@skydock/types";
import {
  AppsT,
  FileExtensions,
  SupportedMimeTypes,
} from "@skydock/types/enums";
import { showToast } from "@skydock/ui/toast";
import { useCallback, useContext } from "react";
import { useBlobFileGenerator } from "../useBlobFileGenerator";
import useFileDownloadWithProgress from "../useFileDownloadWithProgress";
import useFileUploadsAndUpdateState from "../useFileUploadsAndUpdateState";
import { useInvalidApi } from "../useInvalidApis";

type SyncStatus = "saved" | "saving" | "synced" | "error";

const useNotePad = () => {
  const dispatch = useAppDispatch();
  const { content, syncStatus, lastSaved } = useAppSelector(
    (state) => state.notePad.notePadInfo
  );

  const fileInfo = useAppSelector(
    (state) => state.notePad.notePadInfo.textFileInfo
  );

  const { isFileActionModalOn: isFileActionModalOn, lastPosition } =
    useAppSelector((state) => state.notePad.actions);

  const [updateTextFile] = useUpdateTextFileContentMutation();
  const [getTextFileContent] = useGetTextFileContentMutation();
  const [uploadFileAndUpdateState] =
    useFileUploadsAndUpdateState(addItemToFolder);

  const { invalidUserInfo } = useInvalidApi();
  const { openFileOpenerModal, openSaveFileModal } = useContext(
    FileSaveAndOpenModalContext
  );

  const { downloadFile } = useFileDownloadWithProgress();

  const { generateFile } = useBlobFileGenerator();

  const setLastSaved = useCallback(
    (date: Date | null) => {
      dispatch(setNotePadLastSaved(date ? date.toISOString() : null));
    },
    [dispatch]
  );

  const setSyncStatus = useCallback(
    (status: SyncStatus) => {
      dispatch(setNotePadSyncStatus(status));
    },
    [dispatch]
  );

  const setContent = useCallback(
    (newContent: string) => {
      dispatch(setNotePadContent(newContent));
    },
    [dispatch]
  );

  const fetchFileContent = useCallback(
    async (fileInfo: FileT | null) => {
      try {
        if (!fileInfo) {
          throw new Error("No file info available to fetch content");
        }
        // throw new Error("Fetching file content is not implemented yet");
        const content = await getTextFileContent(fileInfo.id).unwrap();
        setContent(content);
        setLastSaved(new Date());
      } catch (error) {
        console.error("Failed to fetch file content:", error);
        HandleError(error).display("Failed to fetch file content");
        setContent("");
        setLastSaved(null);
        setSyncStatus("error");
        // showToast("Ops something went wrong...", "error");
        throw error; // Re-throw to handle it in the component if needed
      }
    },
    [getTextFileContent, setContent, setLastSaved, setSyncStatus]
  );

  // TODO: Add a debounce to setContent to avoid too many updates

  // useEffect(() => {
  //   fetchFileContent(fileInfo);
  // }, [fetchFileContent, fileInfo]);

  // const [] = useDebounce(
  //   () => {
  //     if (content) {
  //       syncToCloud();
  //     }
  //   },
  //   3000,
  //   [content, syncToCloud]
  // );

  // Auto-save to localStorage when content changes
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     syncToCloud();
  //   }, 3000);

  //   return () => clearTimeout(timer);
  // }, [content]);

  const getSyncText = () => {
    switch (syncStatus) {
      case "saving":
        return "Syncing...";
      // case "synced":
      //     return "Synced";
      // case "error":
      //     return "Sync failed";
      default:
        return "Save";
    }
  };

  const getSyncColor = () => {
    switch (syncStatus) {
      // case "saving":
      //     return "bg-blue-500 hover:bg-blue-600";
      // case "synced":
      //     return "bg-green-500 hover:bg-green-600";
      // case "error":
      //     return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-slate-600 hover:bg-slate-700";
    }
  };

  const openFile = useCallback(
    async (file: FileT | null) => {
      if (file) {
        await fetchFileContent(file);
        dispatch(openNotePad(file));
      } else {
        setContent("");
        setLastSaved(null);
        setSyncStatus("saved");
      }
    },
    [dispatch, fetchFileContent, setContent, setLastSaved, setSyncStatus]
  );

  const saveAs = useCallback(() => {
    if (isFileActionModalOn) return;

    dispatch(openNotePadFileActionModal(true));
    openSaveFileModal({
      appName: AppsT.NotePad,
      onSuccess: async ({ fileName, folderId }) => {
        const buffer_file = generateFile({
          content,
          name: fileName,
          type: FileExtensions.txt,
        });
        if (!buffer_file) return;
        const structuredFile = fileArrayGenerator([buffer_file], folderId);
        const files = await uploadFileAndUpdateState(structuredFile);

        if (files && files[0]) {
          openFile(files[0]);
        }
      },
      onClose: () => {
        dispatch(openNotePadFileActionModal(false));
      },
      supportedMimeTypes: [SupportedMimeTypes.Text],
      lastPosition,
    });
  }, [
    content,
    dispatch,
    generateFile,
    isFileActionModalOn,
    lastPosition,
    openFile,
    openSaveFileModal,
    uploadFileAndUpdateState,
  ]);

  const openFileUsingModal = useCallback(() => {
    dispatch(openNotePadFileActionModal(true));
    openFileOpenerModal({
      appName: AppsT.NotePad,
      onSuccess: async (e) => {
        openFile(e as FileT);
      },
      onClose: () => {
        dispatch(openNotePadFileActionModal(false));
      },
      supportedMimeTypes: [SupportedMimeTypes.Text],
      lastPosition,
    });
  }, [dispatch, lastPosition, openFile, openFileOpenerModal]);

  const save = useCallback(async () => {
    if (syncStatus === "saving") return;
    if (!fileInfo) {
      saveAs();
    } else {
      try {
        setSyncStatus("saving");
        await updateTextFile({
          id: fileInfo.id,
          content,
        });
        invalidUserInfo(); // Invalidate user info to ensure the latest data is fetched
        await sleep(RESPONSE_DELAY);
        setSyncStatus("synced");
        setLastSaved(new Date());
      } catch (error) {
        setSyncStatus("error");
      }
      setSyncStatus("saved");
    }
  }, [
    content,
    fileInfo,
    invalidUserInfo,
    saveAs,
    setLastSaved,
    setSyncStatus,
    syncStatus,
    updateTextFile,
  ]);

  const close = useCallback(() => {
    dispatch(closeNotePad());
  }, [dispatch]);

  const download = useCallback(async () => {
    if (!fileInfo) {
      showToast("No file selected to download", "error");
      return;
    }
    return await downloadFile(fileInfo);
  }, [downloadFile, fileInfo]);

  return {
    content,
    setContent,
    syncStatus,
    lastSaved,
    getSyncText,
    getSyncColor,
    isFileActionModalOn,
    saveAs,
    save,
    openFile,
    openFileUsingModal,
    close,
    download,
    fileInfo,
  };
};

export default useNotePad;
