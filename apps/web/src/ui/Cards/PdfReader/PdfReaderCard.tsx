import ActionButton from "@/ui/action-button";
import cn from "@/utils";
import { ThemeT } from "@skydock/types";
import { motion } from "framer-motion";
import { forwardRef, ReactNode, useState } from "react";

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
        const [isMaximized, setIsMaximized] = useState(false);
        return (
            <motion.div
                className={cn("text-black overflow-auto  bg-white resize shadow absolute min-w-[30rem]  max-w-[85%]  min-h-[30rem] max-h-[88%] backdrop-blur rounded-xl  flex flex-col",
                    className,
                    isMaximized ? "max-w-full min-w-[100vw] min-h-[88vh] h-[88vh] top-0 rounded-none resize-none" : "w-[30rem] h-[28rem] resize rounded-xl",
                )}
                ref={ref}
                style={{ left: isMaximized ? 0 : style?.x, top: isMaximized ? 24 : style?.y }}
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.2 }}
                onMouseDown={onMouseDownCard}
                onContextMenu={onContextMenu}
            >
                <div className={cn(" z-20 fixed flex justify-between items-center bg-white/60 backdrop-blur shadow px-2 py-3 rounded w-full", theme?.color,)}
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
                <div className="w-full overflow-hidden h-full flex-1 mt-6 ">
                    {children}
                </div>
            </motion.div>
        );
    }
);

export default PdfReaderCard