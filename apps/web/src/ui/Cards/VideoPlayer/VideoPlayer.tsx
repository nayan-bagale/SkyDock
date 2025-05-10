import cn from "@/utils";
import { ThemeT } from "@skydock/types";
import { motion } from "framer-motion";
import { forwardRef, ReactNode, useState } from "react";

interface VideoPlayerCardProps {
    style: { x: number, y: number };
    onMouseDown: any;
    children?: ReactNode;
    action: {
        close: () => void;
        size: {
            isMaximized: boolean;
            changeSize: () => void;
            lastSize: {
                width: number;
                height: number;
            };
        },
        minimize: () => void;
    };
    onMouseDownCard: () => void;
    className?: string;
    theme: ThemeT | null;
    title: string;
    onContextMenu: (e: React.MouseEvent) => void;
}

export interface Track {
    id: number;
    title: string;
    artist: string;
    duration: number;
    artwork: string;
}

const VideoPlayerCard = forwardRef<HTMLDivElement, VideoPlayerCardProps>(
    ({ style, theme, onMouseDown, action, children, onMouseDownCard, className, title, onContextMenu }, ref) => {
        const [isMaximized, setIsMaximized] = useState(false);
        return (
            <motion.div
                className={cn("text-black  shadow absolute aspect-video min-w-[35rem] max-w-[85vw] min-h-[20rem] max-h-[88vh] backdrop-blur bg-black  overflow-hidden",
                    // theme?.color,
                    className,
                    isMaximized ? "max-w-full min-w-[100vw] min-h-[88vh] top-0 rounded-none resize-none" : "w-[35rem] h-[25rem] resize rounded-xl",
                )}
                ref={ref}
                style={{ left: isMaximized ? 0 : style?.x, top: isMaximized ? 24 : style?.y }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                onMouseDown={onMouseDownCard}
                onContextMenu={onContextMenu}
            >
                <div className={cn("relative flex justify-between items-center bg-white/60 backdrop-blur shadow px-2 py-3 w-full", theme?.color, isMaximized ? "rounded-none border-t border-gray-300" : "rounded")}
                    onMouseDown={onMouseDown}
                >
                    <div className="absolute flex gap-2">
                        <div className="flex justify-center items-center bg-red-400 hover:bg-red-600 hover:shadow rounded-full w-3 h-3 transition-colors cursor-default"
                            onClick={() => action.close()}
                        />
                        <div className="flex justify-center items-center bg-yellow-400 hover:bg-yellow-600 hover:shadow rounded-full w-3 h-3 transition-colors cursor-default"
                            onClick={() => setIsMaximized(!isMaximized)}
                        />
                    </div>
                    <div className="flex justify-center items-center w-full text-xs cursor-default">
                        <span className="font-medium text-sm">{ }</span>
                    </div>
                </div>
                <div className="w-full h-full">
                    {children}
                </div>
            </motion.div>
        );
    }
);

export default VideoPlayerCard