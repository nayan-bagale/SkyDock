import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface UseVideoPlayerProps {
  initialVolume?: number;
}

export const useVideoPlayer = ({
  initialVolume = 1,
}: UseVideoPlayerProps = {}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsTimeout = useRef<NodeJS.Timeout>();

  // Initialize video once metadata is loaded
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      // Set initial volume
      video.volume = volume;
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [volume]);

  // Update progress as video plays
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  // Handle playback state changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Handle controls visibility
  useEffect(() => {
    const resetControlsTimeout = () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }

      setShowControls(true);

      if (isPlaying) {
        controlsTimeout.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    // Register event listeners on the video container element
    const handleMouseMove = () => resetControlsTimeout();
    const handleClick = () => resetControlsTimeout();

    // The container listeners will be set in the component that uses this hook

    resetControlsTimeout();

    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [isPlaying]);

  // Toggle play/pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!video.src) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch((error) => {
        console.error("Error playing video:", error);
        // toast.error("Failed to play video. Please try again.");
      });
    }
  };

  // Change playback speed
  const changePlaybackSpeed = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = speed;
    setPlaybackSpeed(speed);
    // toast.success(`Playback speed: ${speed}x`);
  };

  //   // Enter fullscreen
  //   const enterFullscreen = (element: HTMLElement | null) => {
  //     if (!element) return;

  //     if (element.requestFullscreen) {
  //       element.requestFullscreen().catch((error) => {
  //         console.error("Error attempting to enable fullscreen:", error);
  //         toast.error("Failed to enter fullscreen mode");
  //       });
  //     } else {
  //       toast.error("Fullscreen not supported by your browser");
  //     }
  //   };

  //   // Exit fullscreen
  //   const exitFullscreen = (element: HTMLElement | null) => {
  //     if (!element) return;

  //     if (document.exitFullscreen) {
  //       document.exitFullscreen().catch((error) => {
  //         console.error("Error attempting to exit fullscreen:", error);
  //         toast.error("Failed to exit fullscreen mode");
  //       });
  //     }
  //   };

  const toggleFullscreen = (element: HTMLElement | null) => {
    if (!element) return;

    const isFullscreen = document.fullscreenElement === element;

    if (isFullscreen) {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullscreen(false);
        })
        .catch((error) => {
          console.error("Error attempting to exit fullscreen:", error);
          toast.error("Failed to exit fullscreen mode");
        });
    } else {
      if (element.requestFullscreen) {
        element
          .requestFullscreen()
          .then(() => {
            setIsFullscreen(true);
          })
          .catch((error) => {
            console.error("Error attempting to enter fullscreen:", error);
            toast.error("Failed to enter fullscreen mode");
          });
      } else {
        toast.error("Fullscreen not supported by your browser");
      }
    }
  };

  // Handle progress bar interaction
  const seekTo = (percent: number) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (percent * duration) / 100;
    video.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(percent);
  };

  // Handle volume change
  const changeVolume = (newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure volume is between 0 and 1
    const clampedVolume = Math.max(0, Math.min(1, newVolume));

    video.volume = clampedVolume;
    setVolume(clampedVolume);

    // Update muted state based on volume
    if (clampedVolume === 0) {
      video.muted = true;
      setIsMuted(true);
    } else if (isMuted) {
      video.muted = false;
      setIsMuted(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const newMutedState = !isMuted;
    video.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  // Format time (mm:ss)
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return {
    videoRef,
    isPlaying,
    progress,
    duration,
    currentTime,
    volume,
    isMuted,
    playbackSpeed,
    showControls,
    setShowControls,
    togglePlay,
    changePlaybackSpeed,
    toggleFullscreen,
    isFullscreen,
    // enterFullscreen,
    // exitFullscreen,
    seekTo,
    changeVolume,
    toggleMute,
    formatTime,
  };
};
