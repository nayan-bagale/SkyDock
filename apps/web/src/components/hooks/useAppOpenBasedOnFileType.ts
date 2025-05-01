import { setCurrentFolder } from "@/redux/features/explorer/explorerSlice";
import { openImageViewer } from "@/redux/features/imageViewer/imageViewerSlice";
import { openMusicPlayer } from "@/redux/features/music-player/musicPlayerSlice";
import { useAppDispatch } from "@/redux/hooks";
import { FileT, FolderT } from "@skydock/types";

const useAppOpenBasedOnFileType = (item: FileT | FolderT | null) => {
  const dispatch = useAppDispatch();

  const openApp = () => {
    if (!item) return;
    if (item.isFolder) {
      dispatch(setCurrentFolder(item.id));
    } else if (item.details.type?.startsWith("image/")) {
      dispatch(openImageViewer(item.id));
    } else if (item.details.type?.startsWith("audio/")) {
      dispatch(openMusicPlayer(item.id));
    }
  };

  return { openApp };
};

export default useAppOpenBasedOnFileType;
