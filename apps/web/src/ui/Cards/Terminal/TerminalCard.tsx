import ActionButton from "@/ui/action-button";
import cn from "@/utils";
import { motion } from "framer-motion";
import { forwardRef } from "react";
import CommandsInput from "./CommandsInput";

interface TerminalCardProps {
    style: { x: number, y: number };
    isFocused?: boolean;
    onMouseDown: any;
    Action: {
        close: () => void;
    };
    onClick?: () => void;
    className?: string;
    onMouseDownCard: () => void;

}

export const TerminalCard = forwardRef<HTMLDivElement, TerminalCardProps>(
    ({ style, onMouseDown, onMouseDownCard, Action, isFocused, className }, ref) => {
        return (
            // <AnimatePresence>
            <motion.div className={cn(
                " resize absolute min-w-[32rem] max-w-[55rem] min-h-[18rem] max-h-[40rem] text-gray-200 bg-black/60 backdrop-blur rounded-xl overflow-hidden",

                isFocused && "shadow-app  transition-shadow z-20",
                className
            )}
                ref={ref}
                style={{ left: style.x, top: style.y }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                onMouseDown={onMouseDownCard}
                onContextMenu={(e) => { e.stopPropagation(); e.preventDefault(); }}
            >
                <div className=" flex items-center justify-between px-2 py-1.5 text-sm w-full bg-black/80 rounded"
                    onMouseDown={onMouseDown}
                >
                    <div className=" flex gap-1 absolute">
                        <ActionButton
                            color="dark-red"
                            size={'medium'}
                            onClick={() => Action.close()}
                        />
                    </div>
                    <div className="text-xs w-full flex items-center justify-center cursor-default">Terminal</div>
                </div>
                <CommandsInput />
            </motion.div>
            // </AnimatePresence>
        )
    });
