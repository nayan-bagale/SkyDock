import { Button } from "@/ui/button";
import cn from "@/utils";
import { Icons } from "@skydock/ui/icons";
import { HTMLMotionProps, motion } from "framer-motion";
import { forwardRef, useState } from "react";

interface SettingsCardProps extends HTMLMotionProps<'div'> {
    className?: string;
    style: { x: number, y: number };
    action: {
        close: () => void;
    };
    onMouseDownCard: () => void;
    children?: React.ReactNode;

}

const options = [
    {
        name: 'Apperance',
        Icon: <Icons.Paint className=" h-5 w-5" />,
        id: '1',
    },
    {
        name: 'Usage',
        Icon: <Icons.Pie className=" h-5 w-5" />,
        id: '2',
    },
    {
        name: 'Account',
        Icon: <Icons.Account className=" h-5 w-5" />,
        id: '3',
    },
    {
        name: 'Billing',
        Icon: <Icons.Dollar className=" h-5 w-5" />,
        id: '4',
    },
    {
        name: 'About',
        Icon: <Icons.Logo className=" h-5 w-5" />,
        id: '5',
    }
]

export const SettingsCard = forwardRef<HTMLDivElement, SettingsCardProps>(({ className, onMouseDownCard, children, onMouseDown, action, style }, ref) => {

    const [activeTab, setActiveTab] = useState('1')

    return (
        // <AnimatePresence>
        <motion.div
            ref={ref}
            className={cn(
                "text-black resize shadow absolute w-[40rem] h-[26rem] min-w-[36rem] max-w-[55rem] min-h-[18rem] max-h-[40rem] bg-white/80 backdrop-blur rounded-xl overflow-hidden",
                className
            )}
            style={{ left: style.x, top: style.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onMouseDown={onMouseDownCard}
        >
            <div className=" flex items-center shadow h-9 relative justify-between px-2 py-1 w-full bg-slate-200/60 rounded"
                onMouseDown={onMouseDown}
            >
                <div className=" flex gap-1 absolute">
                    <div className=" h-3 w-3 rounded-full bg-red-400 flex items-center justify-center cursor-default hover:bg-red-600 transition-colors hover:shadow"
                        onClick={() => action.close()}
                    >
                        {/* <Icons.Cross className=" fill-white h-4 w-4" /> */}

                    </div>

                </div>
                <div className="text-base font-medium w-full flex items-center justify-center cursor-default">
                    {'Settings'}
                </div>
                {/* <div className=" w-full flex gap-1 justify-end">
                    </div> */}
            </div>
            <div className=" flex w-full h-full pb-[1.8rem] ">
                <div className="max-w-[12rem] h-full min-w-[9rem]  text-sm justify-between flex flex-col ">

                    <div className="flex flex-col gap-1.5 pt-1.5 ">
                        <div className=" px-2 py-1 flex flex-col space-y-2  ">
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
                                                className="absolute inset-0 bg-white rounded-md shadow-sm z-0"
                                            // transition={{ type: 'spring', duration: 0.5 }}
                                            />
                                        )
                                    }

                                    <span className="flex gap-1 z-10 relative">
                                        {Icon}{name}
                                    </span>
                                </Button>
                            ))}
                            {/* <Button className=" px-1 w-full flex gap-1 shadow-sm bg-white hover:bg-slate-50  drop-shadow-none">
                                    <Icons.Paint className=" h-5 w-5" />
                                    {'Apperance'}
                                </Button>
                                <Button className=" px-1 w-full flex gap-1  hover:bg-slate-50  drop-shadow-none">
                                    <Icons.Pie className=" h-5 w-5" />
                                    {"Usage"}
                                </Button>
                                <Button className=" px-1 w-full flex gap-1 hover:bg-slate-50 drop-shadow-none">
                                    <Icons.Account className=" h-5 w-4" />
                                    {"Account"}
                                </Button>
                                <Button className=" px-1 w-full flex gap-1 hover:bg-slate-50 drop-shadow-none">
                                    <Icons.Dollar className=" h-5 w-5" />
                                    {"Blling"}
                                </Button>
                                <Button className=" px-1 w-full flex gap-1 hover:bg-slate-50 drop-shadow-none">
                                    <Icons.Logo className=" h-5 w-5" />
                                    {"About "}
                                </Button> */}
                        </div>
                    </div>
                </div>
                <div className=" flex flex-col h-full bg-white w-full py-2">
                    <div className=" flex-1 overflow-y-auto ">
                        {children}
                    </div>
                </div>
            </div>
        </motion.div>
        // </AnimatePresence>
    )
})
