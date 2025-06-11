import { onContextMenuTweak } from "@/tweaks/ElementEvent";
import ActionButton from "@/ui/action-button";
import { Button } from "@/ui/button";
import cn from "@/utils";
import { ThemeT } from "@skydock/types";
import { HTMLMotionProps, motion } from "framer-motion";
import { forwardRef, useState } from "react";

interface SettingsCardProps extends HTMLMotionProps<'div'> {
    className?: string;
    style: { x: number, y: number };
    action: {
        close: () => void;
    };
    theme: ThemeT | null;
    onMouseDownCard: () => void;
    children?: React.ReactNode;
    options: {
        name: string;
        Icon: React.ReactNode;
        id: string;
    }[];
    activeTab: string;
    setActiveTab: (id: string) => void;

}

export const SettingsCard = forwardRef<HTMLDivElement, SettingsCardProps>(({ options, theme, className, onMouseDownCard, children, onMouseDown, action, style, activeTab, setActiveTab }, ref) => {
    const [isMaximized, setIsMaximized] = useState(false);

    return (
        // <AnimatePresence>
        <motion.div
            ref={ref}
            className={cn(
                "text-black resize shadow absolute  min-w-[36rem] max-w-[55rem] min-h-[25rem] max-h-[40rem] backdrop-blur rounded-xl overflow-hidden",
                theme?.color,
                isMaximized ? "max-w-full min-w-[100vw] min-h-[88vh] h-[88vh] top-0 rounded-none resize-none" : "w-[40rem] h-[26rem] resize rounded-xl",
                className
            )}
            style={{ left: isMaximized ? 0 : style?.x, top: isMaximized ? 24 : style?.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onMouseDown={onMouseDownCard}
            onContextMenu={onContextMenuTweak}
        >
            <div className="relative flex justify-between items-center bg-slate-200/60 shadow px-2 py-1 rounded w-full h-9"
                onMouseDown={onMouseDown}
            >
                <div className="absolute flex gap-2">
                    <ActionButton
                        color="red"
                        size={'medium'}
                        onClick={() => action.close()}
                    />
                    {/* <ActionButton
                        color="lime"
                        size={'medium'}
                        onClick={() => setIsMaximized(!isMaximized)}
                    /> */}

                </div>
                <div className="flex justify-center items-center w-full font-medium text-sm text-gray-900 cursor-default">
                    {'Settings'}
                </div>
            </div>
            <div className="flex pb-[1.8rem] w-full h-full">
                <div className="flex flex-col justify-between min-w-[9rem] max-w-[12rem] h-full text-sm">

                    <div className="flex flex-col gap-1.5 pt-1.5">
                        <div className="flex flex-col space-y-2 px-2 py-1">
                            {options.map(({ name, id, Icon }, index) => (
                                <Button
                                    key={id}
                                    className={cn(
                                        " px-1 w-full drop-shadow-none relative outline-2 outline-sky-400 focus-visible:outline",
                                        activeTab !== id && 'hover:bg-white/60'
                                    )}
                                    onClick={() => setActiveTab(id)}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                // layout
                                >
                                    {
                                        activeTab === id && (
                                            <motion.div
                                                // layoutId="active-pill"
                                                className="z-0 absolute inset-0 bg-white shadow-sm rounded-md"
                                            // transition={{ type: 'spring', duration: 0.5 }}
                                            />
                                        )
                                    }

                                    <span className="z-10 relative flex gap-1">
                                        {Icon}{name}
                                    </span>
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col bg-white/80 py-2 w-full h-full">
                    <div className="flex-1 px-4 pb-4 overflow-y-auto">
                        {children}
                    </div>
                </div>
            </div>
        </motion.div>
        // </AnimatePresence>
    )
})
