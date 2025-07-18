import useChangeAppFocus from "@/components/hooks/useChangeAppFocus";
import { useDrag } from "@/components/hooks/useDrag";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import MusicPlayerCard from "@/ui/Cards/MusicPlayer/MusicPlayer";
import { Slider } from "@/ui/slider";
import { Loader, Maximize2, Minimize2, Music, Pause, Play, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useRef, useState } from 'react';
// import { tracks, Track } from '@/data/tracks';
import useMusicPlayer from "@/components/hooks/apps/useMusicPlayer";
import { closeMusicPlayer, setMusicPlayerLastPosition } from "@/redux/features/music-player/musicPlayerSlice";
import { motion } from "framer-motion";

export interface Track {
    id: number;
    title: string;
    artist: string;
    duration: number;
    artwork: string;
}

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const MusicPlayer = () => {
    const [isAudioBuffering, setIsAudioBuffering] = useState(false);
    const [minimized, setMinimized] = useState(false);

    const { audioRef, currentTime, volume, isPlaying, onVolumeChange, onTimeUpdate, onProgressChange, duration, setDuration, musicFileInfo, musicUrl, togglePlayPause } = useMusicPlayer();

    const draggableRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const focusedApp = useAppSelector((state) => state.apps.focusedApp);
    const theme = useAppSelector((state) => state.settings.apperance.theme);
    const { handleAppFocus } = useChangeAppFocus('MusicPlayer');
    const { position, handleMouseDown } = useDrag({
        ref: draggableRef,
        onChangePosition: (position) => dispatch(setMusicPlayerLastPosition(position))
    });

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
            dispatch(closeMusicPlayer());

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
        }
    };

    return (
        <>
            {
                !minimized ?
                    (<MusicPlayerCard
                        ref={draggableRef}
                        style={{ x: position.x, y: position.y }}
                        onMouseDown={handleMouseDown}
                        action={Action}
                        onMouseDownCard={handleAppFocus}
                        isFocused={focusedApp === 'MusicPlayer'}
                        theme={theme}
                        title={"Music Player"}
                        onContextMenu={handleContextMenu}
                    >
                        <div className="w-full mx-auto p-6 h-full bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] shadow-xl">
                            <div className=" w-fit mx-auto mb-4 rounded-lg overflow-hidden shadow-lg">
                                {/* <img
                        src={currentTrack.artwork}
                        alt={`${currentTrack.title} artwork`}
                        className="  w-52 h-52 object-cover"
                    /> */}
                                <div className="w-52 h-52 relative flex items-center text-white justify-center bg-gray-600 rounded-lg overflow-hidden">
                                    <Music size={160} />
                                    {isAudioBuffering && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                            <Loader className="animate-spin" size={32} />
                                            {/* <p className="text-white">Buffering</p> */}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="text-white relative max-w-60 overflow-hidden mx-auto items-center flex-col justify-center flex mb-6">
                                {/* <motion.div
                    className="absolute whitespace-nowrap"
                    animate={{
                        x: [6 * musicTitleLength, -6 * musicTitleLength],
                        transition: {
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: musicTitleLength * 0.2,
                                ease: "linear",
                            },
                        },
                    }}
                    > */}
                                <h3 className=" text-center text-base truncate w-full font-bold">{musicFileInfo?.name.split('.').slice(0, -1).join('')}</h3>
                                {/* </motion.div> */}
                                <p className="text-sm opacity-80"></p>
                            </div>

                            <div className="mb-4">
                                <Slider
                                    value={[currentTime]}
                                    min={0}
                                    max={duration}
                                    step={1}
                                    onValueChange={onProgressChange}
                                    className="mb-2"
                                />
                                <div className="flex justify-between text-sm text-white/80">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-6 mb-6">
                                <button
                                    // onClick={handlePrevious}
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    <SkipBack size={24} />
                                </button>
                                <button
                                    onClick={togglePlayPause}
                                    className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-colors"
                                >
                                    {isPlaying ? (
                                        <Pause size={24} className="text-[#9b87f5]" />
                                    ) : (
                                        <Play size={24} className="text-[#9b87f5] ml-1" />
                                    )}
                                </button>
                                <button
                                    // onClick={handleNext}
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    <SkipForward size={24} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">

                                    <Volume2 size={20} className="text-white/80" />
                                    <Slider
                                        value={volume}
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        onValueChange={onVolumeChange}
                                        className="w-24"
                                    />
                                </div>
                                <button
                                    // onClick={togglePlayPause}
                                    onClick={() => setMinimized(true)}
                                    className="w-8 h-8 rounded-xl hover:text-[#9b87f5] text-white shadow-inner flex items-center justify-center hover:bg-white/90 transition-colors"
                                >
                                    {/* {isPlaying ? (
                                <Pause size={24} className="text-[#9b87f5]" />
                            ) : (
                                <Play size={24} className="text-[#9b87f5] ml-1" />
                            )} */}
                                    <Minimize2 size={20} className="" />
                                </button>
                                {/* <button
                            // onClick={handleNext}
                            className="text-white/80  hover:text-white transition-colors"
                        >
                            <List size={24} className="text-white/80" />
                        </button> */}
                            </div>


                        </div>
                    </MusicPlayerCard>)
                    :
                    (<motion.div
                        className=" flex gap-2 items-center absolute right-2 top-8 w-[20rem] p-2 rounded-xl  bg-gradient-to-br from-[#9b87f5] to-[#7E69AB]  shadow"
                        initial={{ opacity: 0, y: -40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                    >
                        <div className="w-12 h-12 min-w-12 relative flex items-center text-white justify-center bg-gray-600 rounded-lg overflow-hidden">
                            <Music size={24} />
                            {isAudioBuffering && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                    <Loader className="animate-spin" size={32} />
                                    {/* <p className="text-white">Buffering</p> */}
                                </div>
                            )}
                        </div>
                        <div className="text-white  flex-col gap-1 relative max-w-60 overflow-hidden mx-auto  justify-center flex ">
                            <h3 className=" text-left text-xs truncate w-full font-bold">{musicFileInfo?.name.split('.').slice(0, -1).join('')}</h3>
                            <div className="flex items-center justify-center gap-6  ">
                                <button
                                    // onClick={handlePrevious}
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    <SkipBack size={16} />
                                </button>
                                <button
                                    onClick={togglePlayPause}
                                    className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-colors"
                                >
                                    {isPlaying ? (
                                        <Pause size={16} className="text-[#9b87f5]" />
                                    ) : (
                                        <Play size={16} className="text-[#9b87f5] ml-1" />
                                    )}
                                </button>
                                <button
                                    // onClick={handleNext}
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    <SkipForward size={16} />
                                </button>
                                <button onClick={() => setMinimized(false)} className=" text-white/80 hover:text-white transition-colors">
                                    <Maximize2 size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>)}
            <audio
                ref={audioRef}
                src={musicUrl || ''}
                onLoadedMetadata={() => {
                    if (audioRef.current) {
                        setDuration(audioRef.current.duration);
                    }
                }
                }
                onTimeUpdate={onTimeUpdate}
                onWaiting={() => setIsAudioBuffering(true)}
                onPlaying={() => setIsAudioBuffering(false)}
                autoPlay
            // onEnded={handleNext}
            />
        </>

    );
};

export default MusicPlayer;