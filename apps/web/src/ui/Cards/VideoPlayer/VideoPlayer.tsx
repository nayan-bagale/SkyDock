import ActionButton from "@/ui/action-button";
import cn from "@/utils";
import { ThemeT } from "@skydock/types";
import { motion } from "framer-motion";
import { forwardRef, ReactNode, useState } from "react";

interface VideoPlayerCardProps {
    style: { x: number, y: number };
    isFocused?: boolean;
    onMouseDown: any;
    children?: ReactNode;
    action: {
        close: () => void;
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
    ({ style, theme, onMouseDown, action, isFocused, children, onMouseDownCard, className, title, onContextMenu }, ref) => {
        const [isMaximized, setIsMaximized] = useState(false);
        return (
            <motion.div
                className={cn("text-black shadow absolute aspect-video min-w-[35rem] max-w-[85vw] min-h-[20rem] max-h-[88vh] backdrop-blur  overflow-hidden",
                    // theme?.color,
                    isFocused && "z-20",
                    (isFocused && !isMaximized) && "shadow-app  transition-shadow",
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
                <div className={cn("relative flex justify-between items-center bg-white/60 backdrop-blur shadow px-2 py-3.5 w-full", theme?.color, isMaximized ? "rounded-none border-t border-gray-300" : "rounded-t")}
                    onMouseDown={onMouseDown}
                >
                    <div className="absolute flex gap-2">
                        <ActionButton
                            color="red"
                            size={'medium'}
                            onClick={() => action.close()}
                        />
                        <ActionButton
                            color="lime"
                            size={'medium'}
                            onClick={() => setIsMaximized(!isMaximized)}
                        />
                    </div>
                    <div className="flex justify-center items-center w-full text-xs cursor-default">
                        <span className="font-medium text-sm">{ }</span>
                    </div>
                </div>
                <div className="w-full bg-black h-full">
                    {children}
                </div>
            </motion.div>
        );
    }
);

export default VideoPlayerCard