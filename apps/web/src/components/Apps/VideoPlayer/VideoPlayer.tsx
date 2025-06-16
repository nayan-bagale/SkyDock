import useChangeAppFocus from '@/components/hooks/useChangeAppFocus';
import { useDrag } from '@/components/hooks/useDrag';
import { closeVideoPlayer } from '@/redux/features/video-player/videoPlayerSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import VideoPlayerCard from '@/ui/Cards/VideoPlayer/VideoPlayer';
import { useEffect, useRef, useState } from 'react';

import useGetFileURl from '@/components/hooks/useGetFileURl';
import { useVideoPlayer } from '@/components/hooks/useVideoPlayer';
import { cn } from '@/utils';
import { AppsT } from '@skydock/types/enums';
import { showToast } from '@skydock/ui/toast';
import { Maximize, Pause, Play, Volume1, Volume2, VolumeX } from 'lucide-react';

const VideoPlayer = () => {

    const draggableRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const focusedApp = useAppSelector((state) => state.apps.focusedApp);
    const theme = useAppSelector((state) => state.settings.apperance.theme);
    const { handleAppFocus } = useChangeAppFocus('VideoPlayer');
    const { position, handleMouseDown } = useDrag({
        ref: draggableRef
    });
    // const explorerItems = useAppSelector((state) => state.explorer.explorerItems);

    const videoInfo = useAppSelector((state) => state.videoPlayer.videoInfo);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // dispatch(openContextMenu({
        //     position: { x: e.clientX, y: e.clientY },
        //     location: 'imageViewer',
        //     additionalData: { currentImageId: imageViewerState?.currentImageId }
        // }));
    };

    const Action = {
        close: () => {
            // Close the image viewer
            // You'll need to add this action to your apps slice
            // dispatch(closeImageViewer())
            dispatch(closeVideoPlayer());

        },
        size: {
            isMaximized: false,
            lastSize: { width: 0, height: 0 },
            changeSize: () => {
                // Toggle maximize
            }
        },
        minimize: () => {
            // Minimize the image viewer
        },
    };


    const playerRef = useRef<HTMLDivElement>(null);
    const [videoUrl, setVideoUrl] = useState<string | undefined>();
    const {
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
        seekTo,
        changeVolume,
        toggleMute,
        formatTime
    } = useVideoPlayer();

    const { getFileUrl } = useGetFileURl()

    useEffect(() => {
        const setUrl = async () => {
            if (videoInfo?.id) {

                if (videoInfo && !videoInfo.isFolder && videoInfo.details.type.startsWith('video/')) {
                    // setMusicTitle(imageItem.name);
                    // In a real app, you would get the image URL from your backend
                    try {

                        const { url } = await getFileUrl(`${videoInfo.id}.${videoInfo.name.split(".").pop()}`)
                        setVideoUrl(url);
                        togglePlay()
                    } catch (error) {
                        console.error('Error fetching video URL:', error);
                        showToast('Error loading video', 'error');
                        dispatch(closeVideoPlayer());
                    }
                    // console.log(url)
                    // setIsPlaying(true);

                    // const audio = new Audio(url);
                    // audio.addEventListener('loadedmetadata', () => {
                    //     console.log(audio)
                    // });
                    // audioRef.current = audio;
                }
            }

        }
        setUrl()
    }, [videoInfo]);

    // Handle mouse movements to show/hide controls
    const handleMouseMove = () => {
        setShowControls(true);
    };

    // Handle progress bar click
    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const percent = ((e.clientX - rect.left) / rect.width) * 100;
        seekTo(percent);
    };

    // Handle volume bar click
    const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const volumeBar = e.currentTarget;
        const rect = volumeBar.getBoundingClientRect();
        const newVolume = (e.clientX - rect.left) / rect.width;
        changeVolume(newVolume);
    };

    // Get appropriate volume icon based on current volume
    const getVolumeIcon = () => {
        if (isMuted || volume === 0) {
            return <VolumeX size={18} />;
        } else if (volume < 0.5) {
            return <Volume1 size={18} />;
        } else {
            return <Volume2 size={18} />;
        }
    };


    return (
        <VideoPlayerCard
            ref={draggableRef}
            style={{ x: position.x, y: position.y }}
            onMouseDown={handleMouseDown}
            action={Action}
            onMouseDownCard={handleAppFocus}
            isFocused={focusedApp === AppsT.VideoPlayer}
            theme={theme}
            title={"Music Player"}
            onContextMenu={handleContextMenu}
        >

            <div
                ref={playerRef}
                className={cn(
                    "video-container relative h-[95%] rounded-lg overflow-hidden shadow-xl bg-black",
                    // className
                )}
                onMouseMove={handleMouseMove}
            >
                <video
                    ref={videoRef}
                    src={videoUrl}
                    className={cn("w-full h-full aspect-video object-contain", !isFullscreen && 'pb-16')}
                    onClick={togglePlay}
                    playsInline
                />

                {/* Overlay for play indicator when paused */}
                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                        <div className="w-16 h-16 rounded-full bg-purple-500/80 flex items-center justify-center">
                            <Play onClick={togglePlay} size={32} className="text-white ml-1" />
                        </div>
                    </div>
                )}

                {/* Video controls overlay */}
                <div
                    className={cn(
                        "video-controls absolute bottom-0 left-0 right-0 px-4 py-3 video-controls-hide",
                        !showControls && "opacity-0"
                    )}
                >
                    {/* Progress bar */}
                    <div
                        className="video-progress-bar mb-3 cursor-pointer"
                        onClick={handleProgressClick}
                    >
                        <div
                            className="video-progress"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {/* Play/pause button */}
                            <button
                                onClick={togglePlay}
                                className="text-white hover:text-purple-400 transition-colors"
                                aria-label={isPlaying ? "Pause" : "Play"}
                            >
                                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                            </button>

                            {/* Volume control */}
                            <div className="flex items-center space-x-2 relative group">
                                <button
                                    onClick={toggleMute}
                                    className="text-white hover:text-purple-400 transition-colors"
                                    aria-label={isMuted ? "Unmute" : "Mute"}
                                >
                                    {getVolumeIcon()}
                                </button>

                                {/* Volume slider */}
                                <div
                                    className="hidden md:block volume-slider w-16 h-1 bg-gray-700 rounded-full cursor-pointer overflow-hidden group-hover:h-2 transition-all"
                                    onClick={handleVolumeClick}
                                >
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-violet-400 transition-all"
                                        style={{ width: `${volume * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Time display */}
                            <div className="text-white text-sm">
                                <span>{formatTime(currentTime)}</span>
                                <span className="mx-1">/</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Playback speed button */}
                            <div className="relative">
                                <button
                                    className="text-white hover:text-purple-400 transition-colors playback-speed-button text-sm font-medium"
                                    aria-label="Change playback speed"
                                >
                                    {playbackSpeed}x
                                </button>

                                {/* Playback speed dropdown */}
                                <div className="playback-speed-dropdown absolute bottom-full mb-2 right-0 bg-black/90 rounded-md py-1 min-w-[80px]">
                                    {[0.5, 1, 1.25, 1.5, 2].map((speed) => (
                                        <button
                                            key={speed}
                                            onClick={() => changePlaybackSpeed(speed)}
                                            className={cn(
                                                "block w-full text-left px-3 py-1 text-sm",
                                                playbackSpeed === speed ? "text-purple-400" : "text-white hover:text-purple-400"
                                            )}
                                        >
                                            {speed}x
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Fullscreen button */}
                            <button
                                onClick={() => toggleFullscreen(playerRef.current)}
                                className="text-white hover:text-purple-400 transition-colors"
                                aria-label="Enter fullscreen"
                            >
                                <Maximize size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </VideoPlayerCard>
    )
}

export default VideoPlayer