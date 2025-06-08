import { setFocusedApp } from "@/redux/features/apps/appsSlice";
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
  closePdfReader,
  openPdfReader,
  setPdfReaderLoading,
} from "@/redux/features/pdf-reader/pdfReaderSlice";
import {
  setSettingsLoading,
  settingsProcess,
} from "@/redux/features/settings/settingsSlice";
import {
  setAppsMenuLoading,
  setAppsMenuOpen,
} from "@/redux/features/skydock/skydockSlice";
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
import { AppsT } from "@skydock/types/enums";
import { useCallback, useMemo } from "react";

const useAppProcess = () => {
  const settingsState = useAppSelector((state) => state.settings);
  const terminalState = useAppSelector((state) => state.terminal);
  const explorerState = useAppSelector((state) => state.explorer);
  const musicPlayerState = useAppSelector((state) => state.musicPlayer);
  const imageViewerState = useAppSelector((state) => state.imageViewer);
  const videoPlayerState = useAppSelector((state) => state.videoPlayer);
  const pdfReaderState = useAppSelector((state) => state.pdfReader);
  const appsMenuState = useAppSelector((state) => state.skydock.appsMenu);

  const focusedApp = useAppSelector((state) => state.apps.focusedApp);

  const dispatch = useAppDispatch();

  const settingsApp = {
    open: useCallback(() => {
      dispatch(settingsProcess(true));
      if (focusedApp !== AppsT.Settings) {
        dispatch(setFocusedApp(AppsT.Settings));
      }
    }, [focusedApp]),

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
      if (focusedApp !== AppsT.Terminal) {
        dispatch(setFocusedApp(AppsT.Terminal));
      }
    }, [focusedApp]),

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
      if (focusedApp !== AppsT.Explorer) {
        dispatch(setFocusedApp(AppsT.Explorer));
      }
    }, [focusedApp]),
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
      if (!musicPlayerState.actions.isProcessOn) {
        dispatch(openMusicPlayer(null));
      }
      if (focusedApp !== AppsT.MusicPlayer) {
        dispatch(setFocusedApp(AppsT.MusicPlayer));
      }
    }, [focusedApp, musicPlayerState.actions.isProcessOn]),
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
      if (!imageViewerState.actions.isProcessOn) {
        dispatch(openImageViewer(null));
      }
      if (focusedApp !== AppsT.ImageViewer) {
        dispatch(setFocusedApp(AppsT.ImageViewer));
      }
    }, [focusedApp, imageViewerState.actions.isProcessOn]),
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
      if (!videoPlayerState.actions.isProcessOn) {
        dispatch(openVideoPlayer(null));
      }
      if (focusedApp !== AppsT.VideoPlayer) {
        dispatch(setFocusedApp(AppsT.VideoPlayer));
      }
    }, [focusedApp, videoPlayerState.actions.isProcessOn]),
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

  const pdfReaderApp = {
    open: useCallback(() => {
      if (!pdfReaderState.actions.isProcessOn) {
        dispatch(openPdfReader(null));
      }
      if (focusedApp !== AppsT.PdfReader) {
        dispatch(setFocusedApp(AppsT.PdfReader));
      }
    }, [focusedApp, pdfReaderState.actions.isProcessOn]),
    close: useCallback(() => {
      dispatch(closePdfReader());
    }, []),
    isProcessOn: pdfReaderState.actions.isProcessOn,
    isLoading: pdfReaderState.state.isLoading,
    setLoadingTrue: useCallback(() => {
      dispatch(setPdfReaderLoading(true));
    }, []),
    setLoadingFalse: useCallback(() => {
      dispatch(setPdfReaderLoading(false));
    }, []),
  };

  const appsMenuSystem = useMemo(() => {
    return {
      isOpen: appsMenuState.isOpen,
      isLoading: appsMenuState.isLoading,
      isProcessOn: appsMenuState.isOpen,
      setLoadingTrue: () => {
        dispatch(setAppsMenuLoading(true));
      },
      setLoadingFalse: () => {
        dispatch(setAppsMenuLoading(false));
      },
      open: () => {
        dispatch(setAppsMenuOpen(true));
      },
      close: () => {
        dispatch(setAppsMenuOpen(false));
      },
    };
  }, [appsMenuState.isLoading, appsMenuState.isOpen]);

  return {
    settingsApp,
    terminalApp,
    explorerApp,
    musicPlayerApp,
    imageViewerApp,
    videoPlayerApp,
    appsMenuSystem,
    pdfReaderApp,
  };
};

export default useAppProcess;
