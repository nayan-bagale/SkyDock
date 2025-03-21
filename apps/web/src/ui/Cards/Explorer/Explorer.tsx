import { FolderT } from "@/types/explorer";
import cn from "@/utils";
import { ExplorerItemsActiveTabs, ThemeT } from "@skydock/types";
import { Icons } from "@skydock/ui/icons";
import { motion } from "framer-motion";
import { forwardRef, Fragment, ReactNode, useState } from "react";
import { Button } from "../../button";

interface ExplorerCardProps {
    style: { x: number, y: number };
    onMouseDown: any;
    children?: ReactNode
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
    currentFolder: FolderT;
    settings: {
        view: {
            func: (v: 'grid' | 'row') => void;
            state: 'grid' | 'row'
        }
    };
    handleFolderTree: {
        forward: {
            disabled: boolean;
            func: () => void;
        },
        backward: {
            disabled: boolean;
            backStack: {
                id: string;
                name: string;
            }[];
            onClickBreadCrumb: (id: string) => void;
            func: () => void;
        }
    },
    handleActiveTabs: {
        func: (tab: ExplorerItemsActiveTabs) => void;
        activeTab: ExplorerItemsActiveTabs;
        tabsOptions: { id: ExplorerItemsActiveTabs, name: string, Icon: JSX.Element }[];
    };
    addFolder: () => void;
    onMouseDownCard: () => void;
    className?: string;
    theme: ThemeT;

}


export const ExplorerCard = forwardRef<HTMLDivElement, ExplorerCardProps>(
    ({ style, theme, onMouseDown, action, children, onMouseDownCard, currentFolder, settings, addFolder, className, handleFolderTree: { forward, backward }, handleActiveTabs }, ref) => {
        // const size_obj = { height: action.size.isMaximized ? remToPx(40) : action.size.lastSize.height, width: action.size.isMaximized ? remToPx(55) : action.size.lastSize.width }
        const [isContextMenuOpen, SetIsContextMenuOpen] = useState(false);

        return (
            // <AnimatePresence>
            <motion.div
                className={cn(" text-black resize shadow absolute w-[40rem] h-[26rem] min-w-[36rem] max-w-[55rem] min-h-[18rem] max-h-[40rem] bg-white/80 backdrop-blur rounded-xl overflow-hidden",
                    theme.color,
                    className
                )}
                ref={ref}
                style={{ left: style.x, top: style.y }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                onMouseDown={onMouseDownCard}
            >
                <div className=" flex items-center shadow relative justify-between px-2 py-1 w-full bg-slate-200/60 rounded"
                    onMouseDown={onMouseDown}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    <div className=" flex gap-1 absolute">
                        <div className=" h-3 w-3 rounded-full bg-red-400 flex items-center justify-center cursor-default hover:bg-red-600 transition-colors hover:shadow"
                            onClick={() => action.close()}
                        >
                            {/* <Icons.Cross className=" fill-white h-4 w-4" /> */}
                        </div>
                        {/* <div className=" h-3 w-3 rounded-full bg-yellow-600"
                                onClick={() => action.size.changeSize()}
                            ></div> */}
                        {/* <div className=" h-3 w-3 rounded-full bg-green-600"
                            onClick={() => Action("close")}
                            ></div> */}
                    </div>
                    <div className="text-xs w-full flex items-center justify-start ml-8 gap-2 cursor-default">
                        <div className=" flex justify-evenly gap-2">
                            <Button intent={'ghost'} size={'icon'} disabled={backward.disabled} onClick={backward.func} className=" p-1">
                                <Icons.Left_Arrow className="h-4 w-4" />
                            </Button>
                            {/* TODO: Added Forward Functionality. */}
                            <Button intent={'ghost'} size={'icon'} disabled={true || forward.disabled} onClick={forward.func} className=" p-1">
                                <Icons.Right_Arrow2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className=" font-medium text-sm">{currentFolder.name}</div>
                    </div>
                    <div className=" w-full flex gap-1 justify-end">
                        <Button onClick={addFolder}>
                            <Icons.Folder_Add className=" h-6 w-6" />
                        </Button>
                        <div className=" border-l border-black mx-2 "></div>
                        <Button onClick={() => settings.view.func('grid')} isActive={settings.view.state === 'grid'} isActiveClassName=" bg-white hover:bg-none">
                            <Icons.Grid4 className=" h-5 w-5" />
                        </Button>
                        <Button onClick={() => settings.view.func('row')} isActive={settings.view.state === 'row'} isActiveClassName=" bg-white hover:bg-none">
                            <Icons.Grid2 className=" h-5 w-5" />
                        </Button>
                    </div>
                </div>
                <div className=" flex w-full h-full pb-[1.8rem]">
                    <div className="max-w-[12rem] h-full min-w-[9rem] text-sm justify-between flex flex-col py-1.5 "
                        onContextMenu={(e) => e.preventDefault()}

                    >

                        <div className="flex flex-col gap-1.5">
                            {/* <div className=" px-2 py-1 flex flex-col gap-1 ">
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
                                        <Icons.Folder className=" h-4 w-4" />
                                        {'Desktop'}
                                    </Button>
                                </div>
                                <div className="">
                                    <Button className=" px-1 w-full flex gap-1 hover:bg-slate-100 drop-shadow-none">
                                        <Icons.Cloud className=" h-4 w-4" />
                                        {"Sky-Drive"}
                                    </Button>
                                </div>
                            </div> */}
                            <div className=" px-2 py-1 flex flex-col gap-1 ">
                                <div className=" text-xs font-semibold text-gray-500">Locations</div>

                                {handleActiveTabs.tabsOptions.map(({ name, id, Icon }, index) => (
                                    <div className="">
                                        <Button
                                            key={id}
                                            className={cn(
                                                " px-1 w-full flex gap-1 hover:bg-slate-100 drop-shadow-none relative outline-2 outline-sky-400 focus-visible:outline",
                                                handleActiveTabs.activeTab !== id && 'hover:bg-white/60'
                                            )}
                                            onClick={() => handleActiveTabs.func(id)}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            {
                                                handleActiveTabs.activeTab === id && (
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
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className=" px-2 py-1 justify-self-end flex flex-col gap-1 ">
                            {/* <div className=" text-xs font-semibold text-gray-500">Locations</div> */}
                            <div className="">
                                <Button

                                    className={cn(
                                        " px-1 w-full flex gap-1 hover:bg-slate-100 drop-shadow-none relative outline-2 outline-sky-400 focus-visible:outline",
                                        handleActiveTabs.activeTab !== 'trash' && 'hover:bg-white/60'
                                    )}
                                    onClick={() => handleActiveTabs.func('trash')}
                                >
                                    {
                                        handleActiveTabs.activeTab === 'trash' && (
                                            <motion.div
                                                // layoutId="active-pill"
                                                className="z-0 absolute inset-0 bg-white shadow-sm rounded-md"
                                            // transition={{ type: 'spring', duration: 0.5 }}
                                            />
                                        )
                                    }

                                    <span className="z-10 relative flex gap-1">
                                        <Icons.Trash2 className=" h-4 w-4" />
                                        {"Trash"}
                                    </span>
                                </Button>
                                {/* <Button className=" px-1 w-full flex gap-1 hover:bg-slate-100 drop-shadow-none">
                                    <Icons.Trash2 className=" h-4 w-4" />
                                    {"Trash"}
                                </Button> */}
                            </div>
                        </div>
                    </div>
                    <div className=" flex flex-col h-full bg-white w-full py-2">
                        <div className=" flex-1 overflow-y-auto "
                            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation() }}
                        >
                            {children}
                        </div>
                        <div className=" text-xs border-t px-2 py-0.5 flex items-center w-full "
                            onContextMenu={(e) => e.preventDefault()}

                        >
                            <Button onClick={() => backward.onClickBreadCrumb(handleActiveTabs.activeTab)} className=" hover:bg-white p-1" size={'icon'} intent={'ghost'}><Icons.Home className=" h-4 w-4" /></Button>
                            {[...backward.backStack, { id: currentFolder.id, name: currentFolder.name }].map((item, index) => index !== 0 && (
                                <Fragment key={item.id}>
                                    <Icons.Right_Arrow className=" mt-1 h-5 w-5" />
                                    <Button onClick={() => backward.onClickBreadCrumb(item.id)}>
                                        {item.name}
                                    </Button>
                                </Fragment>
                            ))
                            }
                        </div>
                    </div>
                </div>
            </motion.div>
            // </AnimatePresence>
        )
    });
