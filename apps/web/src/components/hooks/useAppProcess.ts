import {
  explorerProcess,
  setExplorerLoading,
} from "@/redux/features/explorer/explorerSlice";
import {
  closeImageViewer,
  openImageViewer,
  setImageViewerLoading,
} from "@/redux/features/imageViewer/imageViewerSlice";
import {
  closeMusicPlayer,
  openMusicPlayer,
  setMusicPlayerLoading,
} from "@/redux/features/music-player/musicPlayerSlice";
import {
  setSettingsLoading,
  settingsProcess,
} from "@/redux/features/settings/settingsSlice";
import {
  setTerminalLoading,
  terminalProcess,
} from "@/redux/features/terminal/terminalSlice";
import {
  closeVideoPlayer,
  openVideoPlayer,
  setVideoPlayerLoading,
} from "@/redux/features/video-player/videoPlayerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useCallback } from "react";

const useAppProcess = () => {
  const settingsState = useAppSelector((state) => state.settings);
  const terminalState = useAppSelector((state) => state.terminal);
  const explorerState = useAppSelector((state) => state.explorer);
  const musicPlayerState = useAppSelector((state) => state.musicPlayer);
  const imageViewerState = useAppSelector((state) => state.imageViewer);
  const videoPlayerState = useAppSelector((state) => state.videoPlayer);

  const dispatch = useAppDispatch();

  const settingsApp = {
    open: useCallback(() => {
      dispatch(settingsProcess(true));
    }, []),

    close: useCallback(() => {
      dispatch(settingsProcess(false));
    }, []),
    isProcessOn: settingsState.actions.isProcessOn,
    isLoading: settingsState.state.isLoading,
    setLoadingTrue: useCallback(() => {
      dispatch(setSettingsLoading(true));
    }, []),
    setLoadingFalse: useCallback(() => {
      dispatch(setSettingsLoading(false));
    }, []),
  };

  const terminalApp = {
    open: useCallback(() => {
      dispatch(terminalProcess(true));
    }, []),

    close: useCallback(() => {
      dispatch(terminalProcess(false));
    }, []),
    isProcessOn: terminalState.actions.isProcessOn,
    isLoading: terminalState.state.isLoading,
    setLoadingTrue: useCallback(() => {
      dispatch(setTerminalLoading(true));
    }, []),
    setLoadingFalse: useCallback(() => {
      dispatch(setTerminalLoading(false));
    }, []),
  };

  const explorerApp = {
    open: useCallback(() => {
      dispatch(explorerProcess(true));
    }, []),
    close: useCallback(() => {
      dispatch(explorerProcess(false));
    }, []),
    isProcessOn: explorerState.actions.isProcessOn,
    isLoading: explorerState.state.isLoading,
    setLoadingTrue: useCallback(() => {
      dispatch(setExplorerLoading(true));
    }, []),
    setLoadingFalse: useCallback(() => {
      dispatch(setExplorerLoading(false));
    }, []),
  };

  const musicPlayerApp = {
    open: useCallback(() => {
      dispatch(openMusicPlayer(null));
    }, []),
    close: useCallback(() => {
      dispatch(closeMusicPlayer());
    }, []),
    isProcessOn: musicPlayerState.actions.isProcessOn,
    isLoading: musicPlayerState.state.isLoading,
    setLoadingTrue: useCallback(() => {
      dispatch(setMusicPlayerLoading(true));
    }, []),
    setLoadingFalse: useCallback(() => {
      dispatch(setMusicPlayerLoading(false));
    }, []),
  };

  const imageViewerApp = {
    open: useCallback(() => {
      dispatch(openImageViewer(null));
    }, []),
    close: useCallback(() => {
      dispatch(closeImageViewer());
    }, []),
    isProcessOn: imageViewerState.actions.isProcessOn,
    isLoading: imageViewerState.state.isLoading,
    setLoadingTrue: useCallback(() => {
      dispatch(setImageViewerLoading(true));
    }, []),
    setLoadingFalse: useCallback(() => {
      dispatch(setImageViewerLoading(false));
    }, []),
  };

  const videoPlayerApp = {
    open: useCallback(() => {
      dispatch(openVideoPlayer(null));
    }, []),
    close: useCallback(() => {
      dispatch(closeVideoPlayer());
    }, []),
    isProcessOn: videoPlayerState.actions.isProcessOn,
    isLoading: videoPlayerState.state.isLoading,
    setLoadingTrue: useCallback(() => {
      dispatch(setVideoPlayerLoading(true));
    }, []),
    setLoadingFalse: useCallback(() => {
      dispatch(setVideoPlayerLoading(false));
    }, []),
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
