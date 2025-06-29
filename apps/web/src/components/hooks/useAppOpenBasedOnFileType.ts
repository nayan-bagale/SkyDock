import { setCurrentFolder } from "@/redux/features/explorer/explorerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { FileT, FolderT } from "@skydock/types";
import { SupportedMimeTypes } from "@skydock/types/enums";
import { showToast } from "@skydock/ui/toast";
import { useCallback } from "react";
import useImageViewer from "./apps/useImageViewer";
import useMusicPlayer from "./apps/useMusicPlayer";
import useNotePad from "./apps/useNotePad";
import usePdfReader from "./apps/usePdfReader";
import useVideoPlayer from "./apps/useVideoPlayer";

const useAppOpenBasedOnFileType = (item: FileT | FolderT | null) => {
  const dispatch = useAppDispatch();
  // const { getFileUrl } = useGetFileURl();
  const isTrashTabActive = useAppSelector(
    (state) => state.explorer.activeTab === "trash"
  );
  const { openFile: openTextFile } = useNotePad();
  const { openImageFile } = useImageViewer();
  const { openMusicFile } = useMusicPlayer();
  const { openPdfFile } = usePdfReader();
  const { openVideoFile } = useVideoPlayer();

  const isItemStartsWith = useCallback(
    (type: string) => {
      if (!item) return false;
      const itemType = (item as FileT).details.type;
      return itemType ? itemType.startsWith(type) : false;
    },
    [item]
  );

  const openApp = useCallback(() => {
    if (!item) return;
    if (isTrashTabActive && !item.isFolder) {
      showToast("To open file restore it", "warning");
      return;
    }
    if (item.isFolder) {
      dispatch(setCurrentFolder(item.id));
    } else if (isItemStartsWith(SupportedMimeTypes.Image)) {
      openImageFile(item);
    } else if (isItemStartsWith(SupportedMimeTypes.Audio)) {
      openMusicFile(item);
    } else if (isItemStartsWith(SupportedMimeTypes.Video)) {
      // dispatch(openVideoPlayer(item));
      openVideoFile(item);
    } else if (isItemStartsWith(SupportedMimeTypes.PDF)) {
      openPdfFile(item);
    } else if (isItemStartsWith(SupportedMimeTypes.Text)) {
      openTextFile(item);
    }
  }, [
    dispatch,
    isItemStartsWith,
    isTrashTabActive,
    item,
    openImageFile,
    openMusicFile,
    openPdfFile,
    openTextFile,
    openVideoFile,
  ]);

  return { openApp };
};

export default useAppOpenBasedOnFileType;
