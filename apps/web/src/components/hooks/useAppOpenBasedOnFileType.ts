import { setCurrentFolder } from "@/redux/features/explorer/explorerSlice";
import { openImageViewer } from "@/redux/features/imageViewer/imageViewerSlice";
import { openMusicPlayer } from "@/redux/features/music-player/musicPlayerSlice";
import { openPdfReader } from "@/redux/features/pdf-reader/pdfReaderSlice";
import { openVideoPlayer } from "@/redux/features/video-player/videoPlayerSlice";
import { useAppDispatch } from "@/redux/hooks";
import { FileT, FolderT } from "@skydock/types";
import { SupportedMimeTypes } from "@skydock/types/enums";
import useNotePad from "./apps/useNotePad";

const useAppOpenBasedOnFileType = (item: FileT | FolderT | null) => {
  const dispatch = useAppDispatch();
  // const { getFileUrl } = useGetFileURl();
  const { openFile } = useNotePad();

  const isItemStartsWith = (type: string) => {
    if (!item) return false;
    const itemType = (item as FileT).details.type;
    return itemType ? itemType.startsWith(type) : false;
  };

  const openApp = () => {
    if (!item) return;
    if (item.isFolder) {
      dispatch(setCurrentFolder(item.id));
    } else if (isItemStartsWith(SupportedMimeTypes.Image)) {
      dispatch(openImageViewer(item.id));
    } else if (isItemStartsWith(SupportedMimeTypes.Audio)) {
      dispatch(openMusicPlayer(item));
    } else if (isItemStartsWith(SupportedMimeTypes.Video)) {
      dispatch(openVideoPlayer(item));
    } else if (isItemStartsWith(SupportedMimeTypes.PDF)) {
      dispatch(openPdfReader(item));
    } else if (isItemStartsWith(SupportedMimeTypes.Text)) {
      openFile(item);
    }
  };

  return { openApp };
};

export default useAppOpenBasedOnFileType;
