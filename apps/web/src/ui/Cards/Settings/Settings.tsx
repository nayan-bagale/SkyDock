import { Button } from "@/ui/button";
import cn from "@/utils";
import { ThemeT } from "@skydock/types";
import { HTMLMotionProps, motion } from "framer-motion";
import { forwardRef } from "react";

interface SettingsCardProps extends HTMLMotionProps<'div'> {
    className?: string;
    style: { x: number, y: number };
    action: {
        close: () => void;
    };
    theme: ThemeT;
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
    return (
        // <AnimatePresence>
        <motion.div
            ref={ref}
            className={cn(
                "text-black resize shadow absolute w-[40rem] h-[26rem] min-w-[36rem] max-w-[55rem] min-h-[18rem] max-h-[40rem] backdrop-blur rounded-xl overflow-hidden",
                theme.color,
                className
            )}
            style={{ left: style.x, top: style.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onMouseDown={onMouseDownCard}
        >
            <div className="relative flex justify-between items-center bg-slate-200/60 shadow px-2 py-1 rounded w-full h-9"
                onMouseDown={onMouseDown}
            >
                <div className="absolute flex gap-1">
                    <div className="flex justify-center items-center bg-red-400 hover:bg-red-600 hover:shadow rounded-full w-3 h-3 transition-colors cursor-default"
                        onClick={() => action.close()}
                    >
                        {/* <Icons.Cross className="fill-white w-4 h-4" /> */}

                    </div>

                </div>
                <div className="flex justify-center items-center w-full font-medium text-base cursor-default">
                    {'Settings'}
                </div>
                {/* <div className="flex justify-end gap-1 w-full">
                    </div> */}
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
                                    transition={{ duration: 0.3 * index }}
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
                    <div className="flex-1 px-4 overflow-y-auto">
                        {children}
                    </div>
                </div>
            </div>
        </motion.div>
        // </AnimatePresence>
    )
})
