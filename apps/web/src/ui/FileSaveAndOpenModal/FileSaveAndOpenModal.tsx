import IconByMimeType from "@/components/FileIconByMimeType";
import useExplorer from "@/components/hooks/apps/useExplorer";
import { useDrag } from "@/components/hooks/useDrag";
import { useAppSelector } from "@/redux/hooks";
import cn from "@/utils";
import {
    ExplorerItemsActiveTabs,
    ExplorerItemT,
    ExplorerT,
    FileDetailsT,
    FileT,
    FolderT,
} from "@skydock/types";
import { Icons } from "@skydock/ui/icons";
import { showToast } from "@skydock/ui/toast";
import { motion } from "framer-motion";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import ActionButton from "../action-button";
import { Button } from "../button";
import { Input } from "../input";
import { DisplayItemsIcons } from "./DisplayItemsIcons";

interface FileSaveAndOpenModalT {
    closeModal: (() => void) | null;
    onSuccess: ((item: ExplorerItemT | FileDetailsT) => void) | null;
    action: "open" | "save";
    supportedMimeTypes: string[] | null;
    lastPosition?: { x: number; y: number };
}

const FileSaveAndOpenModal: FC<FileSaveAndOpenModalT> = ({
    closeModal,
    action,
    onSuccess,
    supportedMimeTypes,
    lastPosition,
}) => {
    const draggableRef = useRef<HTMLDivElement>(null);
    const { position, handleMouseDown } = useDrag({
        ref: draggableRef,
        lastPosition: lastPosition,
    });
    const theme = useAppSelector((state) => state.settings.apperance.theme);
    const [activeTab, setActiveTab] =
        useState<ExplorerT["activeTab"]>("skydrive");
    const { addFolder } = useExplorer();

    const tabsOptions = useMemo<
        {
            name: string;
            id: ExplorerItemsActiveTabs;
            Icon: JSX.Element;
        }[]
    >(() => {
        return [
            {
                name: "Sky-Drive",
                id: "skydrive",
                Icon: <Icons.Cloud className="w-4 h-4" />,
            },
            {
                name: "Desktop",
                id: "desktop",
                Icon: <Icons.Folder className="w-4 h-4" />,
            },
        ];
    }, []);

    const explorerItems = useAppSelector((state) => state.explorer.explorerItems);
    const [currentFolder, setCurrentFolder] =
        useState<ExplorerT["currentFolder"]>("skydrive");
    const [backward, setBackward] = useState<string[]>([]);
    const [selectedItem, setSelectedItem] = useState<FileT | FolderT | null>(
        null
    );
    const [fileName, setFileName] = useState<string>('');

    const item = useMemo(() => {
        return explorerItems[currentFolder];
    }, [currentFolder, explorerItems]);

    const files = useMemo(
        () =>
            (item as FolderT)?.children
                .map((child) => explorerItems[child])
                .filter((item) => {
                    if (item.isFolder) return true;
                    if (
                        !item.isFolder &&
                        supportedMimeTypes?.includes(item.details?.type || "")
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                })
                .sort((a) => (a.isFolder ? -1 : 1)),
        [explorerItems, item, supportedMimeTypes]
    );

    useEffect(() => {
        if (action === 'save') {
            const count = files.filter((file) => !file.isFolder && file.name.startsWith('untitled')).length;
            setFileName(`untitled${count > 0 ? `(${count})` : ''}.txt`);
        }
    }, [])

    const openItem = (item: FolderT | FileT) => {
        if (item.isFolder) {
            setCurrentFolder(item.id);
            setBackward((prev) => {
                return [...prev, item.parent];
            });
            setSelectedItem(null);
        }
    };

    const backwardFunc = useCallback(() => {
        if (backward) {
            const prevFolder = backward[backward.length - 1];
            setCurrentFolder(prevFolder);
            setBackward((prev) => {
                return prev.filter((item) => item !== prevFolder);
            });
            setSelectedItem(null);
        }
    }, [backward]);

    const changeTab = useCallback((tab: ExplorerT["activeTab"]) => {
        setActiveTab(tab);
        setCurrentFolder(tab);
        setBackward([]);
        setSelectedItem(null);
    }, []);

    const handleActiveTabs = {
        func: (tab: ExplorerT["activeTab"]) => changeTab(tab),
        activeTab,
        tabsOptions,
    };

    const selectedItemFunc = useCallback((item: FileT | FolderT | null) => {
        setSelectedItem(item);
    }, []);

    const submitButtonText = useMemo(() => {
        if (selectedItem?.isFolder) return "Open Folder";

        if (action === "open") {
            return "Select File";
        } else if (action === "save") {
            return "Save in Folder";
        }
    }, [action, selectedItem?.isFolder]);

    const submitButtonAction = useCallback(() => {
        if (selectedItem?.isFolder) {
            openItem(selectedItem as FolderT);
            return;
        }
        if (action === "save") {
            const isFileNameExists = files.some(
                (file) => file.name === fileName && file.isFolder === false
            );

            if (isFileNameExists) {
                showToast("File name already exists", "error");
                return;
            }
            onSuccess?.({
                fileName,
                folderId: currentFolder,
            });
        } else if (action === "open") {
            if (!selectedItem) return;
            onSuccess?.(selectedItem as FileT | FolderT);
        }
    }, [action, currentFolder, fileName, files, onSuccess, selectedItem]);

    const isSubmitDisabled = useMemo(() => {
        if (action === "save") {
            return !currentFolder && !selectedItem;
        } else {
            // For open action, we can select a file or folder
            return !selectedItem;
        }
    }, [action, currentFolder, selectedItem]);

    return (
        <motion.div
            className={cn(
                " text-gray-800 overflow-hidden  rounded-xl flex flex-col resize shadow absolute w-[30rem] h-[20rem] min-w-[30rem] max-w-[55rem] min-h-[18rem] max-h-[40rem] bg-white/80 backdrop-blur ",
                theme?.color,
                "z-20",
                "shadow-md  transition-shadow"
            )}
            ref={draggableRef}
            style={{ left: position?.x, top: position?.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <div
                className="relative flex justify-between items-center bg-slate-200/60 shadow px-2 py-0.5 rounded w-full"
                onMouseDown={handleMouseDown}
                onContextMenu={(e) => e.preventDefault()}
            >
                <div className="flex">
                    <ActionButton
                        color="red"
                        size={"medium"}
                        onClick={() => closeModal?.()}
                    />
                </div>
                <div className="flex justify-start items-center gap-2 ml-6 w-full text-xs cursor-default">
                    <div className="flex justify-evenly gap-2">
                        <Button
                            intent={"ghost"}
                            size={"icon"}
                            disabled={backward.length === 0}
                            onClick={backwardFunc}
                            className="p-1"
                        >
                            <Icons.Left_Arrow className="w-4 h-4" />
                        </Button>
                        {/* TODO: Added Forward Functionality. */}
                        <Button
                            intent={"ghost"}
                            size={"icon"}
                            disabled={true}
                            // onClick={forward.func}
                            className="p-1"
                        >
                            <Icons.Right_Arrow2 className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="font-medium text-xs">
                        {explorerItems[currentFolder].name}
                    </div>
                </div>
                <Button onClick={() => addFolder(currentFolder)} size={"icon"}>
                    <Icons.Folder_Add className="w-6 h-6" />
                </Button>
            </div>
            <div className="flex w-full pb-8 shadow-inner h-full">
                <div
                    className="flex flex-col justify-between py-1.5 min-w-[7rem] max-w-[12rem] h-full text-sm"
                    onContextMenu={(e) => e.preventDefault()}
                >
                    <div className="flex flex-col gap-1.5">
                        <div className="flex flex-col gap-1 px-2 py-1">
                            <div className="font-semibold text-gray-500 text-xs">
                                Locations
                            </div>

                            {handleActiveTabs.tabsOptions.map(({ name, id, Icon }, index) => (
                                <div className="">
                                    <Button
                                        key={id}
                                        className={cn(
                                            " px-1 w-full flex gap-1 hover:bg-slate-100 drop-shadow-none relative outline-2 outline-sky-400 focus-visible:outline",
                                            handleActiveTabs.activeTab !== id && "hover:bg-white/60"
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

                                        <span className="z-10 text-xs relative flex gap-1">
                                            {Icon}
                                            {name}
                                        </span>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div
                    onClick={() => selectedItemFunc(null)}
                    className="flex pb-10 overflow-auto  flex-1 flex-col h-full bg-white p-2 w-full"
                >
                    {item?.isFolder && (
                        <div className={cn("relative", " w-full")}>
                            {files.map((item) => {
                                return (
                                    <ItemDisplay
                                        key={item.id}
                                        item={item}
                                        openItem={openItem}
                                        selectedItemFunc={selectedItemFunc}
                                        selectedItem={selectedItem}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <div
                className={cn("flex absolute bottom-0 shadow gap-2 items-center  bg-slate-200 px-4  py-1  border-t w-full text-xs",
                    action === 'save' ? 'justify-between' : 'justify-end'
                )}
                onContextMenu={(e) => e.preventDefault()}
            >
                <Button
                    size={"small"}
                    className="px-2 py-1"
                    intent={"destructive"}
                    onClick={() => closeModal?.()}
                >
                    Cancel
                </Button>
                {action === 'save' && <Input
                    className="w-48 text-gray-900 placeholder:text-gray-600 border-gray-400 rounded-lg"
                    // value={action === "open" ? selectedItem?.name ?? '' : fileName}
                    value={fileName}
                    onChange={(e) => {
                        setFileName(e.target.value);
                    }}
                    // disabled={action === "open"}
                    placeholder="File Name"
                />}
                <Button
                    className="px-2 py-1"
                    size={"small"}
                    disabled={isSubmitDisabled}
                    onClick={submitButtonAction}
                    intent={"secondary"}
                >
                    {submitButtonText}
                </Button>
            </div>
        </motion.div>
    );
};

const ItemDisplay = ({
    item,
    openItem,
    selectedItemFunc,
    selectedItem,
}: {
    item: FolderT | FileT;
    openItem: (item: FolderT | FileT) => void;
    selectedItemFunc: (item: FolderT | FileT | null) => void;
    selectedItem: FileT | FolderT | null;
}) => {
    const Icon = IconByMimeType(
        "type" in item.details ? item.details.type : null
    );

    const handleDoubleClick = () => {
        openItem(item);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
            openItem(item);
        }
    };

    const handleContextMenu = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        e.preventDefault();
        e.stopPropagation();
    };
    return (
        <div key={item.id} className="relative">
            <DisplayItemsIcons
                view={"row"}
                Icon={Icon}
                item={item}
                onContextMenu={handleContextMenu}
                onDoubleClick={handleDoubleClick}
                onKeyDown={handleKeyDown}
                onClick={(e) => {
                    e.stopPropagation();
                    selectedItemFunc(item);
                }}
                className={cn(selectedItem?.id === item.id && "bg-gray-400/20")}
            />
        </div>
    );
};

export default FileSaveAndOpenModal;
