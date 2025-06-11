import ActionButton from "@/ui/action-button";
import cn from "@/utils";
import { ThemeT } from "@skydock/types";
import { motion } from "framer-motion";
import { forwardRef, ReactNode } from "react";

interface SubscriptionPlanWrapperProps {
    style: { x: number; y: number };
    onMouseDown: any;
    children?: ReactNode;
    action: {
        close: () => void;
    };
    onMouseDownCard: () => void;
    className?: string;
    theme: ThemeT | null;
    onContextMenu: (e: React.MouseEvent) => void;
}

const SubscriptionPlanWrapper = forwardRef<
    HTMLDivElement,
    SubscriptionPlanWrapperProps
>(({ theme, onMouseDown, action, children, className, onContextMenu }, ref) => {
    return (
        <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            onContextMenu={onContextMenu}
            className=" absolute flex bg-black/20 z-30 justify-center items-center inset-0"
        >
            <motion.div
                className={cn(
                    "text-black shadow absolute bg-stone-100 min-w-[40rem] max-w-[80rem] min-h-[30rem] max-h-[40rem] rounded-xl overflow-hidden",
                    // theme?.color,
                    className
                )}
                ref={ref}
                initial={{ opacity: 0, y: 20, }}
                animate={{ opacity: 1, y: 0, }}
                exit={{ opacity: 0, y: 20, }}
                transition={{ duration: 0.3 }}
            >
                <div
                    className="relative flex justify-between items-center px-2 py-4 rounded w-full"
                    onMouseDown={onMouseDown}
                >
                    <div className="absolute flex gap-1">
                        <ActionButton
                            color="red"
                            size={'medium'}
                            onClick={() => action.close()}
                        />
                    </div>
                    <div className="flex justify-center items-center w-full text-xs cursor-default"></div>
                </div>
                <div className="w-full h-full">{children}</div>
            </motion.div>
        </motion.div>
    );
});

export default SubscriptionPlanWrapper;
