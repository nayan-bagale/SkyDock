import { FolderT } from "@/types/explorer";
import cn from "@/utils";
import { ExplorerItemsActiveTabs, ThemeT } from "@skydock/types";
import { Icons } from "@skydock/ui/icons";
import { motion } from "framer-motion";
import { forwardRef, Fragment, ReactNode } from "react";
import { Button } from "../../button";

interface ExplorerCardProps {
    style: { x: number; y: number };
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
        };
    };
    currentFolder: FolderT;
    settings: {
        view: {
            func: (v: "grid" | "row") => void;
            state: "grid" | "row";
        };
    };
    handleFolderTree: {
        forward: {
            disabled: boolean;
            func: () => void;
        };
        backward: {
            disabled: boolean;
            backStack: {
                id: string;
                name: string;
            }[];
            onClickBreadCrumb: (id: string) => void;
            func: () => void;
        };
    };
    handleActiveTabs: {
        func: (tab: ExplorerItemsActiveTabs) => void;
        activeTab: ExplorerItemsActiveTabs;
        tabsOptions: {
            id: ExplorerItemsActiveTabs;
            name: string;
            Icon: JSX.Element;
        }[];
    };
    addFolder: () => void;
    onMouseDownCard: () => void;
    className?: string;
    theme: ThemeT | null;
    onContextMenu: (e: React.MouseEvent) => void;
    onEmptyTrash: () => void;
}

export const ExplorerCard = forwardRef<HTMLDivElement, ExplorerCardProps>(
    (
        {
            style,
            theme,
            onMouseDown,
            action,
            children,
            onMouseDownCard,
            currentFolder,
            settings,
            addFolder,
            className,
            handleFolderTree: { forward, backward },
            handleActiveTabs,
            onContextMenu,
            onEmptyTrash,
        },
        ref
    ) => {
        return (
            // <AnimatePresence>
            <motion.div
                className={cn(
                    " text-black resize shadow absolute w-[40rem] h-[26rem] min-w-[36rem] max-w-[55rem] min-h-[18rem] max-h-[40rem] bg-white/80 backdrop-blur rounded-xl overflow-hidden",
                    theme?.color,
                    className
                )}
                ref={ref}
                style={{ left: style.x, top: style.y }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                onMouseDown={onMouseDownCard}
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                <div
                    className="relative h-9 flex justify-between items-center bg-slate-200/60 shadow px-2 py-1 rounded w-full"
                    onMouseDown={onMouseDown}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    <div className="absolute flex gap-1">
                        <div
                            className="flex justify-center items-center bg-red-400 hover:bg-red-600 hover:shadow rounded-full w-3 h-3 transition-colors cursor-default"
                            onClick={() => action.close()}
                        >
                            {/* <Icons.Cross className="fill-white w-4 h-4" /> */}
                        </div>
                        {/* <div className="bg-yellow-600 rounded-full w-3 h-3"
                                onClick={() => action.size.changeSize()}
                            ></div> */}
                        {/* <div className="bg-green-600 rounded-full w-3 h-3"
                            onClick={() => Action("close")}
                            ></div> */}
                    </div>
                    <div className="flex justify-start items-center gap-2 ml-8 w-full text-xs cursor-default">
                        <div className="flex justify-evenly gap-2">
                            <Button
                                intent={"ghost"}
                                size={"icon"}
                                disabled={backward.disabled}
                                onClick={backward.func}
                                className="p-1"
                            >
                                <Icons.Left_Arrow className="w-4 h-4" />
                            </Button>
                            {/* TODO: Added Forward Functionality. */}
                            <Button
                                intent={"ghost"}
                                size={"icon"}
                                disabled={true || forward.disabled}
                                onClick={forward.func}
                                className="p-1"
                            >
                                <Icons.Right_Arrow2 className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="font-medium text-sm">{currentFolder.name}</div>
                    </div>
                    <div className="flex justify-end gap-1 w-full">
                        {handleActiveTabs.activeTab === "trash" ? (
                            <Button
                                onClick={onEmptyTrash}
                                size={'small'}
                                className="gap-1"
                            >
                                <Icons.Trash3 className="w-5 h-5" /> Empty Trash
                            </Button>
                        ) : (
                            <Button onClick={addFolder}>
                                <Icons.Folder_Add className="w-6 h-6" />
                            </Button>
                        )}
                        <div className="mx-2 border-black border-l"></div>
                        <Button
                            onClick={() => settings.view.func("grid")}
                            isActive={settings.view.state === "grid"}
                            isActiveClassName=" bg-white hover:bg-none"
                        >
                            <Icons.Grid4 className="w-5 h-5" />
                        </Button>
                        <Button
                            onClick={() => settings.view.func("row")}
                            isActive={settings.view.state === "row"}
                            isActiveClassName=" bg-white hover:bg-none"
                        >
                            <Icons.Grid2 className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
                <div className="flex pb-[1.8rem] w-full h-full">
                    <div
                        className="flex flex-col justify-between py-1.5 min-w-[9rem] max-w-[12rem] h-full text-sm"
                        onContextMenu={(e) => e.preventDefault()}
                    >
                        <div className="flex flex-col gap-1.5">
                            <div className="flex flex-col gap-1 px-2 py-1">
                                <div className="font-semibold text-gray-500 text-xs">
                                    Locations
                                </div>

                                {handleActiveTabs.tabsOptions.map(
                                    ({ name, id, Icon }, index) => (
                                        <div className="">
                                            <Button
                                                key={id}
                                                className={cn(
                                                    " px-1 w-full flex gap-1 hover:bg-slate-100 drop-shadow-none relative outline-2 outline-sky-400 focus-visible:outline",
                                                    handleActiveTabs.activeTab !== id &&
                                                    "hover:bg-white/60"
                                                )}
                                                onClick={() => handleActiveTabs.func(id)}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                {handleActiveTabs.activeTab === id && (
                                                    <motion.div
                                                        // layoutId="active-pill"
                                                        className="z-0 absolute inset-0 bg-white shadow-sm rounded-md"
                                                    // transition={{ type: 'spring', duration: 0.5 }}
                                                    />
                                                )}

                                                <span className="z-10 relative flex gap-1">
                                                    {Icon}
                                                    {name}
                                                </span>
                                            </Button>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col justify-self-end gap-1 px-2 py-1">
                            {/* <div className="font-semibold text-gray-500 text-xs">Locations</div> */}
                            <div className="">
                                <Button
                                    className={cn(
                                        " px-1 w-full flex gap-1 hover:bg-slate-100 drop-shadow-none relative outline-2 outline-sky-400 focus-visible:outline",
                                        handleActiveTabs.activeTab !== "trash" &&
                                        "hover:bg-white/60"
                                    )}
                                    onClick={() => handleActiveTabs.func("trash")}
                                >
                                    {handleActiveTabs.activeTab === "trash" && (
                                        <motion.div
                                            // layoutId="active-pill"
                                            className="z-0 absolute inset-0 bg-white shadow-sm rounded-md"
                                        // transition={{ type: 'spring', duration: 0.5 }}
                                        />
                                    )}

                                    <span className="z-10 relative flex gap-1">
                                        <Icons.Trash2 className="w-4 h-4" />
                                        {"Trash"}
                                    </span>
                                </Button>
                                {/* <Button className="flex gap-1 hover:bg-slate-100 drop-shadow-none px-1 w-full">
                                    <Icons.Trash2 className="w-4 h-4" />
                                    {"Trash"}
                                </Button> */}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col bg-white py-2 w-full h-full">
                        <div
                            className="flex-1 overflow-y-auto"
                            onContextMenu={onContextMenu}
                        >
                            {children}
                        </div>
                        <div
                            className="flex items-center px-2 py-0.5 border-t w-full text-xs"
                            onContextMenu={(e) => e.preventDefault()}
                        >
                            <Button
                                onClick={() =>
                                    backward.onClickBreadCrumb(handleActiveTabs.activeTab)
                                }
                                className="hover:bg-white p-1"
                                size={"icon"}
                                intent={"ghost"}
                            >
                                <Icons.Home className="w-4 h-4" />
                            </Button>
                            {[
                                ...backward.backStack,
                                { id: currentFolder.id, name: currentFolder.name },
                            ].map(
                                (item, index) =>
                                    index !== 0 && (
                                        <Fragment key={item.id}>
                                            <Icons.Right_Arrow className="mt-1 w-5 h-5" />
                                            <Button
                                                onClick={() => backward.onClickBreadCrumb(item.id)}
                                            >
                                                {item.name}
                                            </Button>
                                        </Fragment>
                                    )
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
            // </AnimatePresence>
        );
    }
);
