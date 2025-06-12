import { onContextMenuTweak } from "@/tweaks/ElementEvent";
import ActionButton from "@/ui/action-button";
import cn from "@/utils";
import { ThemeT } from "@skydock/types";
import { motion } from "framer-motion";
import { forwardRef, ReactNode, useState } from "react";

interface ImageViewerCardProps {
    style: { x: number, y: number };
    isFocused?: boolean;
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
        }
    };
    onMouseDownCard: () => void;
    className?: string;
    theme: ThemeT | null;
    title: string;
    onContextMenu: (e: React.MouseEvent) => void;
}

export const ImageViewerCard = forwardRef<HTMLDivElement, ImageViewerCardProps>(
    ({ style, theme, onMouseDown, action, children, onMouseDownCard, isFocused, className, title, onContextMenu }, ref) => {
        const [isMaximized, setIsMaximized] = useState(false);
        return (
            <motion.div
                className={cn("text-black resize shadow absolute  min-w-[30rem] max-w-[60rem] min-h-[20rem] max-h-[45rem] bg-white/80 backdrop-blur rounded-xl overflow-hidden",
                    theme?.color,
                    isFocused && "z-20",
                    (isFocused && !isMaximized) && "shadow-app  transition-shadow",
                    isMaximized ? "max-w-full min-w-[100vw] min-h-[88vh] h-[88vh] top-0 rounded-none resize-none" : "w-[40rem] h-[30rem] resize rounded-xl",

                    className
                )}
                ref={ref}
                style={{ left: isMaximized ? 0 : style?.x, top: isMaximized ? 24 : style?.y }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                onMouseDown={onMouseDownCard}
                onContextMenu={onContextMenu}
            >
                <div className="relative flex justify-between items-center bg-slate-200/60 shadow px-2 py-1 rounded w-full"
                    onMouseDown={onMouseDown}
                    onContextMenu={onContextMenuTweak}
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
                        <span className="font-medium text-gray-900 text-sm">{title}</span>
                    </div>
                </div>
                <div className="w-full h-[calc(100%-1.7rem)]">
                    {children}
                </div>
            </motion.div>
        );
    }
); 