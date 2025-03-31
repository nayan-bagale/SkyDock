import cn from "@/utils";
import { ThemeT } from "@skydock/types";
import { motion } from "framer-motion";
import { forwardRef, ReactNode } from "react";

interface ImageViewerCardProps {
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
        }
    };
    onMouseDownCard: () => void;
    className?: string;
    theme: ThemeT;
    title: string;
    onContextMenu: (e: React.MouseEvent) => void;
}

export const ImageViewerCard = forwardRef<HTMLDivElement, ImageViewerCardProps>(
    ({ style, theme, onMouseDown, action, children, onMouseDownCard, className, title, onContextMenu }, ref) => {
        return (
            <motion.div
                className={cn("text-black resize shadow absolute w-[40rem] h-[30rem] min-w-[30rem] max-w-[60rem] min-h-[20rem] max-h-[45rem] bg-white/80 backdrop-blur rounded-xl overflow-hidden",
                    theme.color,
                    className
                )}
                ref={ref}
                style={{ left: style.x, top: style.y }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                onMouseDown={onMouseDownCard}
                onContextMenu={onContextMenu}
            >
                <div className="relative flex justify-between items-center bg-slate-200/60 shadow px-2 py-1 rounded w-full"
                    onMouseDown={onMouseDown}
                >
                    <div className="absolute flex gap-1">
                        <div className="flex justify-center items-center bg-red-400 hover:bg-red-600 hover:shadow rounded-full w-3 h-3 transition-colors cursor-default"
                            onClick={() => action.close()}
                        />
                    </div>
                    <div className="flex justify-center items-center w-full text-xs cursor-default">
                        <span className="font-medium text-sm">{title}</span>
                    </div>
                </div>
                <div className="w-full h-[calc(100%-2rem)]">
                    {children}
                </div>
            </motion.div>
        );
    }
); 