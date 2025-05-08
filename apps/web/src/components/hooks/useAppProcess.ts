import { explorerProcess } from "@/redux/features/explorer/explorerSlice";
import {
  closeImageViewer,
  openImageViewer,
} from "@/redux/features/imageViewer/imageViewerSlice";
import {
  closeMusicPlayer,
  openMusicPlayer,
} from "@/redux/features/music-player/musicPlayerSlice";
import { settingsProcess } from "@/redux/features/settings/settingsSlice";
import { terminalProcess } from "@/redux/features/terminal/terminalSlice";
import {
  closeVideoPlayer,
  openVideoPlayer,
} from "@/redux/features/video-player/videoPlayerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useCallback } from "react";

const useAppProcess = () => {
  const isSettingsOpen = useAppSelector(
    (state) => state.settings.actions.isProcessOn
  );
  const isTerminalOpen = useAppSelector(
    (state) => state.terminal.actions.isProcessOn
  );
  const isExplorerOpen = useAppSelector(
    (state) => state.explorer.actions.isProcessOn
  );

  const isMusicPlayerOpen = useAppSelector(
    (state) => state.musicPlayer.actions.isProcessOn
  );

  const isImageViewerOpen = useAppSelector(
    (state) => state.imageViewer.actions.isProcessOn
  );

  const isVideoPlayerOpen = useAppSelector(
    (state) => state.videoPLayer.actions.isProcessOn
  );

  const dispatch = useAppDispatch();

  const settingsApp = {
    open: useCallback(() => {
      dispatch(settingsProcess(true));
    }, []),

    close: useCallback(() => {
      dispatch(settingsProcess(false));
    }, []),
    isProcessOn: isSettingsOpen,
  };

  const terminalApp = {
    open: useCallback(() => {
      dispatch(terminalProcess(true));
    }, []),

    close: useCallback(() => {
      dispatch(terminalProcess(false));
    }, []),
    isProcessOn: isTerminalOpen,
  };

  const explorerApp = {
    open: useCallback(() => {
      dispatch(explorerProcess(true));
    }, []),
    close: useCallback(() => {
      dispatch(explorerProcess(false));
    }, []),
    isProcessOn: isExplorerOpen,
  };

  const musicPlayerApp = {
    open: useCallback(() => {
      dispatch(openMusicPlayer(null));
    }, []),
    close: useCallback(() => {
      dispatch(closeMusicPlayer());
    }, []),
    isProcessOn: isMusicPlayerOpen,
  };

  const imageViewerApp = {
    open: useCallback(() => {
      dispatch(openImageViewer(null));
    }, []),
    close: useCallback(() => {
      dispatch(closeImageViewer());
    }, []),
    isProcessOn: isImageViewerOpen,
  };

  const videoPlayerApp = {
    open: useCallback(() => {
      dispatch(openVideoPlayer(null));
    }, []),
    close: useCallback(() => {
      dispatch(closeVideoPlayer());
    }, []),
    isProcessOn: isVideoPlayerOpen,
  };

  return {
    settingsApp,
    terminalApp,
    explorerApp,
    musicPlayerApp,
    imageViewerApp,
    videoPlayerApp,
  };
};

export default useAppProcess;
