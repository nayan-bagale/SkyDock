import { AnimatePresence, motion } from "framer-motion";
import { forwardRef, ReactNode } from "react";
import { Icons } from "../../../icons";
import cn from "../../../utils";
import { Button } from "../../button";

interface FilesExplorerCardProps {
    style: { x: number, y: number };
    onMouseDown: any;
    children?: ReactNode
    Action: {
        process: (p: any) => void;
    };
    title?: string;
    navButtons: {
        func: (v: any) => void;
        state: 'grid' | 'row'
    };

}


export const FilesExplorerCard = forwardRef<HTMLDivElement, FilesExplorerCardProps>(
    ({ style, onMouseDown, Action, children, title = 'CatX', navButtons }, ref) => {

        return (
            <AnimatePresence>
                <motion.div className={cn(" text-black resize shadow absolute w-[36rem] h-[22rem] min-w-[36rem] max-w-[55rem] min-h-[18rem] max-h-[40rem] z-20 bg-white/80 backdrop-blur rounded-xl overflow-hidden")}
                    ref={ref}
                    style={{ left: style.x, top: style.y }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className=" flex items-center shadow relative justify-between px-2 py-1 w-full bg-slate-200/60 rounded"
                        onMouseDown={onMouseDown}
                    >
                        <div className=" flex gap-1 absolute">
                            <div className=" h-3 w-3 rounded-full bg-red-400 flex items-center justify-center cursor-default hover:bg-red-500 transition-colors hover:shadow"
                                onClick={() => Action.process("off")}
                            >
                                {/* <Icons.Cross className=" h-4 w-4" /> */}
                            </div>
                            {/* <div className=" h-3 w-3 rounded-full bg-yellow-600"
                            onClick={() => Action("")}
                        ></div>
                        <div className=" h-3 w-3 rounded-full bg-green-600"
                            onClick={() => Action("close")}
                        ></div> */}
                        </div>
                        <div className="text-xs w-full flex items-center justify-start ml-8 gap-2 cursor-default">
                            <div className=" flex justify-evenly gap-2">
                                <Button intent={'ghost'} size={'icon'} disabled={true} className=" p-1">
                                    <Icons.Left_Arrow className="h-4 w-4" />
                                </Button>
                                <Button intent={'ghost'} size={'icon'} className=" p-1">
                                    <Icons.Right_Arrow2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className=" text-sm">{title}</div>
                        </div>
                        <div className=" w-full flex gap-1 justify-end">
                            <Button>
                                <Icons.Folder_Add className=" h-6 w-6" />
                            </Button>
                            <div className=" border-l border-black mx-2 "></div>
                            <Button onClick={() => navButtons.func({ view: 'grid' })} isActive={navButtons.state === 'grid'} isActiveClassName=" bg-white hover:bg-none">
                                <Icons.Grid4 className=" h-5 w-5" />
                            </Button>
                            <Button onClick={() => navButtons.func({ view: 'row' })} isActive={navButtons.state === 'row'} isActiveClassName=" bg-white hover:bg-none">
                                <Icons.Grid2 className=" h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                    <div className=" flex w-full h-full pb-[1.5rem]">
                        <div className="max-w-[12rem] min-w-[9rem] text-sm gap-1.5 flex flex-col py-2 ">
                            <div className=" px-2 py-1 flex flex-col gap-1 ">
                                <div className=" text-xs font-semibold text-gray-500">Favourites</div>
                                <div className="">
                                    <Button className=" px-1 w-full flex gap-1 hover:bg-slate-100 drop-shadow-none">
                                        <Icons.Folder className=" h-4 w-4" />
                                        {'Desktop'}
                                    </Button>
                                </div>
                            </div>
                            <div className=" px-2 py-1 flex flex-col gap-1 ">
                                <div className=" text-xs font-semibold text-gray-500">Locations</div>
                                <div className="">
                                    <Button className=" px-1 w-full flex gap-1 hover:bg-slate-100 drop-shadow-none">
                                        <Icons.Cloud className=" h-4 w-4" />
                                        {"Nayan's CatX"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className=" flex flex-col h-full bg-white w-full py-2">
                            <div className=" flex-1 overflow-y-auto ">
                                {children}
                            </div>
                            <div className=" text-xs border-t px-2 py-1 flex items-center w-full ">
                                <Button className=" hover:bg-white p-1" size={'icon'} intent={'ghost'}><Icons.Home className=" h-4 w-4" /></Button>
                                <Icons.Right_Arrow className=" mt-1 h-5 w-5" />
                                <Button>
                                    Nayan
                                </Button>
                            </div>

                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        )
    });
