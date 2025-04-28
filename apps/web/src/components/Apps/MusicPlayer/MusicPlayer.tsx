import useChangeAppFocus from "@/components/hooks/useChangeAppFocus";
import { useDrag } from "@/components/hooks/useDrag";
import { useAppSelector } from "@/redux/hooks";
import MusicPlayerCard from "@/ui/Cards/MusicPlayer/MusicPlayer";
import { Slider } from "@/ui/slider";
import { List, Pause, Play, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
// import { tracks, Track } from '@/data/tracks';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@skydock/ui/drawer";

export interface Track {
    id: number;
    title: string;
    artist: string;
    duration: number;
    artwork: string;
}

const tracks: Track[] = [
    {
        id: 1,
        title: "Summer Breeze",
        artist: "Chill Waves",
        duration: 245, // 4:05
        artwork: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Midnight Dreams",
        artist: "Luna Beats",
        duration: 183, // 3:03
        artwork: "https://images.unsplash.com/photo-1616356607338-fd87169ecf1a?w=300&h=300&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Ocean Waves",
        artist: "Nature Sounds",
        duration: 221, // 3:41
        artwork: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=300&h=300&auto=format&fit=crop"
    }
];

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const MusicPlayer = () => {
    const focusedApp = useAppSelector((state) => state.apps.focusedApp);
    const theme = useAppSelector((state) => state.settings.apperance.theme);
    const { handleAppFocus } = useChangeAppFocus('MusicPlayer');
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState([0.7]);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const currentTrack: Track = tracks[currentTrackIndex];
    const draggableRef = useRef<HTMLDivElement>(null);

    const { position, handleMouseDown } = useDrag({
        ref: draggableRef
    });

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handlePrevious = () => {
        setCurrentTrackIndex((prevIndex) =>
            prevIndex === 0 ? tracks.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentTrackIndex((prevIndex) =>
            prevIndex === tracks.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleProgressChange = (newValue: number[]) => {
        if (audioRef.current) {
            audioRef.current.currentTime = newValue[0];
            setCurrentTime(newValue[0]);
        }
    };

    const handleVolumeChange = (newValue: number[]) => {
        if (audioRef.current) {
            audioRef.current.volume = newValue[0];
            setVolume(newValue);
        }
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume[0];
        }
    }, [currentTrackIndex]);

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
        <MusicPlayerCard
            ref={draggableRef}
            style={{ x: position.x, y: position.y }}
            onMouseDown={handleMouseDown}
            action={Action}
            onMouseDownCard={handleAppFocus}
            className={focusedApp === 'ImageViewer' ? 'z-20' : ''}
            theme={theme}
            title={"Music Player"}
            onContextMenu={handleContextMenu}
        >
            <div className="w-full mx-auto p-6 h-full bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] shadow-xl">
                <div className=" w-fit mx-auto mb-4 rounded-lg overflow-hidden shadow-lg">
                    <img
                        src={currentTrack.artwork}
                        alt={`${currentTrack.title} artwork`}
                        className="  w-52 h-52 object-cover"
                    />
                    {/* <div className="w-52 h-52 flex items-center text-white justify-center bg-gray-600 rounded-lg overflow-hidden">
                        <Music size={160} />
                    </div> */}
                </div>

                <div className="text-white items-center flex-col justify-center flex  w-full mb-6">
                    <h3 className=" text-base font-bold truncate">{currentTrack.title}</h3>
                    <p className="text-sm opacity-80">{currentTrack.artist}</p>
                </div>

                <div className="mb-4">
                    <Slider
                        value={[currentTime]}
                        min={0}
                        max={currentTrack.duration}
                        step={1}
                        onValueChange={handleProgressChange}
                        className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-white/80">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(currentTrack.duration)}</span>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-6 mb-6">
                    <button
                        onClick={handlePrevious}
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
                        onClick={handleNext}
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
                            onValueChange={handleVolumeChange}
                            className="w-24"
                        />
                    </div>
                    <Drawer>
                        <DrawerTrigger><List size={24} className="text-white/80" /></DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                                <DrawerDescription>This action cannot be undone.</DrawerDescription>
                            </DrawerHeader>
                            <DrawerFooter>
                                <button>Submit</button>
                                <DrawerClose>
                                    <button>Cancel</button>
                                </DrawerClose>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                    {/* <button
                        onClick={handleNext}
                        className="text-white/80 hover:text-white transition-colors"
                    >
                        <List size={24} className="text-white/80" />

                    </button> */}
                </div>

                <audio
                    ref={audioRef}
                    src={`https://example.com/music/${currentTrack.id}.mp3`}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleNext}
                />
            </div>
        </MusicPlayerCard>
    );
};

export default MusicPlayer;