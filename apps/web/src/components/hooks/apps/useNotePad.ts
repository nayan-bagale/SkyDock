import {
  useGetTextFileContentMutation,
  useUpdateTextFileContentMutation,
} from "@/redux/apis/filesAndFolderApi";
import { addItemToFolder } from "@/redux/features/explorer/explorerSlice";
import {
  openNotePad,
  setNotePadContent,
  setNotePadLastSaved,
  setNotePadSyncStatus,
} from "@/redux/features/note-pad/notePadSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fileArrayGenerator } from "@/utils/file-array-generator";
import { FileT } from "@skydock/types";
import { FileExtensions } from "@skydock/types/enums";
import { useCallback, useEffect } from "react";
import { useFileGenerator } from "../useFileGenerator";
import useFileUploadsAndUpdateState from "../useFileUploadsAndUpdateState";

type SyncStatus = "saved" | "saving" | "synced" | "error";

const useNotePad = () => {
  const dispatch = useAppDispatch();
  const { content, syncStatus, lastSaved } = useAppSelector(
    (state) => state.notePad.notePadInfo
  );

  const fileInfo = useAppSelector(
    (state) => state.notePad.notePadInfo.textFileInfo
  );

  const isFileActionModalOn = useAppSelector(
    (state) => state.notePad.actions.isFileActionModalOn
  );

  const [updateTextFile] = useUpdateTextFileContentMutation();
  const [getTextFileContent] = useGetTextFileContentMutation();
  const [uploadFileAndUpdateState] =
    useFileUploadsAndUpdateState(addItemToFolder);

  const { generateFile } = useFileGenerator();

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
        const content = await getTextFileContent(fileInfo.id).unwrap();
        setContent(content);
        setLastSaved(new Date());
      } catch (error) {
        console.error("Failed to fetch file content:", error);
        setContent("");
        setLastSaved(null);
        setSyncStatus("error");
      }
    },
    [getTextFileContent, setContent, setLastSaved, setSyncStatus]
  );

  // useEffect(() => {
  //   fetchFileContent(fileInfo);
  // }, [fetchFileContent, fileInfo]);

  const syncToCloud = useCallback(async () => {
    setSyncStatus("saving");

    try {
      // Simulate API call delay
      // await new Promise((resolve) => setTimeout(resolve, 1500));
      if (!fileInfo) {
        throw new Error("No file info available to update");
      }

      await updateTextFile({
        id: fileInfo.id,
        content,
      }).unwrap();

      setSyncStatus("synced");
      setLastSaved(new Date());
    } catch (error) {
      setSyncStatus("error");
    }
    setSyncStatus("saved");
  }, [content, fileInfo, setLastSaved, setSyncStatus, updateTextFile]);

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

  // Keyboard shortcut for save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        syncToCloud();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [syncToCloud]);

  //   const getSyncIcon = () => {
  //     switch (syncStatus) {
  //       // case "saving":
  //       //     return <Cloud className="w-4 h-4 animate-pulse" />;
  //       // case "synced":
  //       //     return <Check className="w-4 h-4" />;
  //       // case "error":
  //       //     return <CloudOff className="w-4 h-4" />;
  //       default:
  //         return <Save className="w-4 h-4" />;
  //     }
  //   };

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
    (file: FileT | null) => {
      if (file) {
        fetchFileContent(file);
        dispatch(openNotePad(file));
      } else {
        setContent("");
        setLastSaved(null);
        setSyncStatus("saved");
      }
    },
    [dispatch, fetchFileContent, setContent, setLastSaved, setSyncStatus]
  );

  const saveAs = useCallback(
    async ({
      content,
      name,
      type,
      folderId,
    }: {
      content: string;
      name: string;
      folderId: string;
      type: FileExtensions.txt;
    }) => {
      const buffer_file = generateFile({
        content,
        name,
        type,
      });
      if (!buffer_file) return;
      const structuredFile = fileArrayGenerator([buffer_file], folderId);
      const files = await uploadFileAndUpdateState(structuredFile);

      if (files && files[0]) {
        openFile(files[0]);
      }
    },
    [generateFile, openFile, uploadFileAndUpdateState]
  );

  return {
    content,
    setContent,
    syncStatus,
    syncToCloud,
    lastSaved,
    // getSyncIcon,
    getSyncText,
    getSyncColor,
    isFileActionModalOn,
    saveAs,
    openFile,
  };
};

export default useNotePad;
