import ActionButton from "@/ui/action-button";
import cn from "@/utils";
import { ThemeT } from "@skydock/types";
import { HTMLMotionProps, motion } from "framer-motion";
import { forwardRef, ReactNode, useState } from "react";


type NotePadCardProps = {
    style: { x: number, y: number };
    isFocused?: boolean;
    onMouseDown: any;
    children?: ReactNode;
    action: {
        close: () => void;
    };
    onMouseDownCard: () => void;
    className?: string;
    theme: ThemeT | null;
    title: string;
    onContextMenu: (e: React.MouseEvent) => void;
} & HTMLMotionProps<"div">;

const NotePadCard = forwardRef<HTMLDivElement, NotePadCardProps>(
    ({ style, theme, onMouseDown, isFocused, action, children, onMouseDownCard, className, title, onContextMenu, ...props }, ref) => {
        const [isMaximized, setIsMaximized] = useState(false);
        return (
            <motion.div
                className={cn("text-black overflow-auto  bg-white resize shadow absolute min-w-[30rem]  max-w-[85%]  min-h-[30rem] max-h-[88%] backdrop-blur rounded-xl  flex flex-col",
                    className,
                    isFocused && "z-20",
                    (isFocused && !isMaximized) && "shadow-app  transition-shadow",
                    isMaximized ? "max-w-full min-w-[100vw] min-h-[88vh] h-[88vh] top-0 rounded-none resize-none" : "w-[30rem] h-[28rem] resize rounded-xl",
                )}
                ref={ref}
                style={{ left: isMaximized ? 0 : style?.x, top: isMaximized ? 24 : style?.y }}
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.2 }}
                onMouseDown={onMouseDownCard}
                onContextMenu={onContextMenu}
                {...props}
            >
                <div className={cn(" z-20 fixed flex justify-between items-center bg-white/60 backdrop-blur px-2 py-3.5 rounded w-full", theme?.color,)}
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
                <div className="w-full h-full flex-1 mt-7 flex flex-col overflow-hidden">
                    {children}
                </div>
            </motion.div>
        )
    })

export default NotePadCard