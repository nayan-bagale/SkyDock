import { FileSaveAndOpenModalContext } from "@/components/ContextApi/FileSaveAndOpenModal";
import { useGetFileUrlMutation } from "@/redux/apis/filesAndFolderApi";
import {
  closeMusicPlayer,
  openMusicPlayer,
  setMusicFileActionModalOn,
  setMusicUrl,
} from "@/redux/features/music-player/musicPlayerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fileIdGenerator } from "@/utils";
import { FileT } from "@skydock/types";
import { AppsT, SupportedMimeTypes } from "@skydock/types/enums";
import { showToast } from "@skydock/ui/toast";
import { useCallback, useContext, useRef, useState } from "react";
import useFileDownloadWithProgress from "../useFileDownloadWithProgress";

const useMusicPlayer = () => {
  const dispatch = useAppDispatch();
  const musicUrl = useAppSelector(
    (state) => state.musicPlayer.musicPlayerInfo.musicUrl
  );
  const musicFileInfo = useAppSelector(
    (state) => state.musicPlayer.musicPlayerInfo.musicFileInfo
  );
  const lastPosition = useAppSelector(
    (state) => state.musicPlayer.actions.lastPosition
  );
  const { openFileOpenerModal } = useContext(FileSaveAndOpenModalContext);
  const { downloadFile } = useFileDownloadWithProgress();
  const [getFileUrl] = useGetFileUrlMutation();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState([1]);
  const [duration, setDuration] = useState(0);

  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const onTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const onProgressChange = useCallback((newValue: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newValue[0];
      setCurrentTime(newValue[0]);
    }
  }, []);

  const onVolumeChange = useCallback((newValue: number[]) => {
    if (audioRef.current) {
      audioRef.current.volume = newValue[0];
      setVolume(newValue);
    }
  }, []);

  const openMusicFile = useCallback(
    async (item: FileT | null) => {
      if (item) {
        try {
          const { url } = await getFileUrl(fileIdGenerator(item)).unwrap();
          dispatch(setMusicUrl(url));
          dispatch(openMusicPlayer(item));
        } catch (error) {
          showToast("Failed to open music file.", "error");
        }
      }
    },
    [dispatch, getFileUrl]
  );

  const openMusicFileUsingModal = useCallback(() => {
    dispatch(setMusicFileActionModalOn(true));
    openFileOpenerModal({
      appName: AppsT.MusicPlayer,
      onSuccess: async (file) => {
        await openMusicFile(file as FileT);
      },
      onClose: () => {
        dispatch(setMusicFileActionModalOn(false));
      },
      supportedMimeTypes: [SupportedMimeTypes.Audio],
      lastPosition,
    });
  }, [dispatch, lastPosition, openFileOpenerModal, openMusicFile]);

  const download = useCallback(async () => {
    if (!musicFileInfo) {
      showToast("No music file selected for download.", "error");
      return;
    }
    return downloadFile(musicFileInfo);
  }, [downloadFile, musicFileInfo]);

  const close = useCallback(() => {
    dispatch(closeMusicPlayer());
  }, [dispatch]);

  return {
    audioRef,
    musicUrl,
    isPlaying,
    currentTime,
    volume,
    duration,
    musicFileInfo,
    setDuration,
    togglePlayPause,
    onTimeUpdate,
    onProgressChange,
    onVolumeChange,
    download,
    openMusicFile,
    openMusicFileUsingModal,
    close,
  };
};

export default useMusicPlayer;
