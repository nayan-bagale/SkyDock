import { setCurrentFolder } from "@/redux/features/explorer/explorerSlice";
import { openImageViewer } from "@/redux/features/imageViewer/imageViewerSlice";
import { openMusicPlayer } from "@/redux/features/music-player/musicPlayerSlice";
import { openVideoPlayer } from "@/redux/features/video-player/videoPlayerSlice";
import { useAppDispatch } from "@/redux/hooks";
import { FileT, FolderT } from "@skydock/types";

const useAppOpenBasedOnFileType = (item: FileT | FolderT | null) => {
  const dispatch = useAppDispatch();

  const isItemStartsWith = (type: string) => {
    if (!item) return false;
    const itemType = (item as FileT).details.type;
    return itemType ? itemType.startsWith(type) : false;
  };

  const openApp = () => {
    if (!item) return;
    if (item.isFolder) {
      dispatch(setCurrentFolder(item.id));
    } else if (isItemStartsWith("image/")) {
      dispatch(openImageViewer(item.id));
    } else if (isItemStartsWith("audio/")) {
      dispatch(openMusicPlayer(item.id));
    } else if (isItemStartsWith("video/")) {
      dispatch(openVideoPlayer(item.id));
    }
  };

  return { openApp };
};

export default useAppOpenBasedOnFileType;
