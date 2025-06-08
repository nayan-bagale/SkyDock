import cn from "@/utils";
import { ThemeT } from "@skydock/types";
import { motion } from "framer-motion";
import { forwardRef, ReactNode } from "react";

interface PdfReaderCardProps {
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
    theme: ThemeT | null;
    title: string;
    onContextMenu: (e: React.MouseEvent) => void;
}

const PdfReaderCard = forwardRef<HTMLDivElement, PdfReaderCardProps>(
    ({ style, theme, onMouseDown, action, children, onMouseDownCard, className, title, onContextMenu }, ref) => {
        return (
            <motion.div
                className={cn("text-black bg-white resize shadow absolute min-w-[30rem] max-w-[45rem] min-h-[30rem] max-h-[40rem] backdrop-blur rounded-xl overflow-hidden",
                    // theme?.color,
                    className
                )}
                ref={ref}
                style={{ left: style?.x, top: style?.y }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                onMouseDown={onMouseDownCard}
                onContextMenu={onContextMenu}
            >
                <div className={cn("relative flex justify-between items-center bg-white/60 backdrop-blur shadow px-2 py-3 rounded w-full", theme?.color,)}
                    onMouseDown={onMouseDown}
                >
                    <div className="absolute flex gap-1">
                        <div className="flex justify-center items-center bg-red-400 hover:bg-red-600 hover:shadow rounded-full w-3 h-3 transition-colors cursor-default"
                            onClick={() => action.close()}
                        />
                    </div>
                    <div className="flex justify-center items-center w-full text-xs cursor-default">
                        <span className="font-medium text-sm">{ }</span>
                    </div>
                </div>
                <div className="w-full h-full overflow-y-scroll">
                    {children}
                </div>
            </motion.div>
        );
    }
);

export default PdfReaderCard