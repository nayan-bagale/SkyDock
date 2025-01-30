import useDeleteFolderRecursively from "@/components/hooks/useDeleteFolderRecursively";
import useFileDownloadWithProgress from "@/components/hooks/useFileDownloadWithProgress";
import useOnClickOutside from "@/components/hooks/useOnclickOutside";
import { useDeleteFileMutation, useDeleteFolderMutation, useRenameItemMutation } from "@/redux/APISlice";
import { deleteItem, renameItem, setCurrentFolder } from "@/redux/features/explorer/explorerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "@/ui/button";
import { ContextMenu, ContextMenuSeparator } from "@/ui/ContextMenu";
import { DisplayItemsIcons } from "@/ui/DisplayItemsIcons";
import cn from "@/utils";
import { FileT, FolderT } from "@repo/types";
import { Icons } from "@repo/ui/icons";
import { FC, useEffect, useRef, useState } from "react";

export type handleDragStartT = (e: React.DragEvent, item: FileT | FolderT) => void;
export type handleReorderT = (e: React.DragEvent, targetIndex: number) => void;

const ItemsWrapper: FC<{ item: FileT | FolderT, Icon: typeof Icons.Closed_Eye, handleDragStart: handleDragStartT; handleReorder: handleReorderT }> =
    ({ item, Icon, handleDragStart, handleReorder }) => {
        const [contextMenu, SetContextMenu] = useState(false);
        const [deleteFile] = useDeleteFileMutation();
        const [getNestedFolderItemsId] = useDeleteFolderRecursively();
        const [deleteFolder] = useDeleteFolderMutation();
        const { downloadFile } = useFileDownloadWithProgress();
        const [renameItem_] = useRenameItemMutation();

        const contextMenuRef = useRef<HTMLDivElement>(null)
        const dispatch = useAppDispatch()

        const [editing, setEditing] = useState(false)
        const [name, setName] = useState(item.name)

        const rename = {
            editing,
            setEditing,
            name,
            setName
        }

        const view = useAppSelector((state) => state.explorer.settings.view)

        const position = view === 'grid' ? ' left-4' : ' left-12'

        useOnClickOutside(contextMenuRef, (currentRef) => {

            console.log(currentRef)
            SetContextMenu(false)
        });

        const saveNewNameToStore = async () => {
            try {
                await renameItem_({ id: item.id, name })
                dispatch(renameItem({ id: item.id, name }))
            } catch (error) {
                console.log(error)
            }
            setEditing(false)
        }

        const handleContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>,) => {
            e.preventDefault();
            SetContextMenu(!contextMenu);
            // setPosition({ x: e.clientX, y: e.clientY });
        }

        const handleDownload = async () => {
            await downloadFile(item as FileT)
        }


        const handleDelete = async () => {
            try {
                if (item.isFolder) {
                    const arrayItems = getNestedFolderItemsId(item.id, [item.id])
                    await deleteFolder(arrayItems)
                } else {
                    await deleteFile(item.id)
                }
                dispatch(deleteItem(item.id))
            } catch (error) {
                console.log(error)
            }
        }

        const handleOpen = () => {
            console.log('open')
            if (item.isFolder) {
                dispatch(setCurrentFolder(item.id))
            }
        }

        const handleDoubleClick = () => {
            if (item.isFolder) {
                dispatch(setCurrentFolder(item.id))
            }
        }

        const handleRename = () => {
            setEditing(true)
            SetContextMenu(false)
        }

        const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'Enter') {
                handleOpen()
            }
        }


        return (
            <div className="relative">
                <DisplayItemsIcons
                    view={view}
                    Icon={Icon}
                    rename={rename}
                    saveNewNameToStore={saveNewNameToStore}
                    item={item}
                    onContextMenu={handleContextMenu}
                    onDoubleClick={handleDoubleClick}
                    onKeyDown={handleKeyDown}
                    handleDragStart={handleDragStart}
                    handleReorder={handleReorder}
                />
                {contextMenu && (
                    <ContextMenu ref={contextMenuRef} className={position}>
                        {item.isFolder && <Button size={'menu'} className=" " onClick={handleOpen}>
                            Open
                        </Button>}
                        {!(item.isFolder) && <Button size={'menu'} className=" " onClick={handleDownload}>
                            Download
                        </Button>}
                        <Button size={'menu'} className=" " onClick={handleRename}>
                            Rename
                        </Button>
                        <ContextMenuSeparator />
                        <Button size={'menu'} className=" hover:bg-red-600" onClick={handleDelete}>
                            <div>Delete</div>
                            <Icons.Trash className=" h-4" />
                        </Button>
                    </ContextMenu>
                )}
            </div>
        )
    }

const SetIcon: FC<{ item: FileT | FolderT; handleDragStart: handleDragStartT; handleReorder: handleReorderT }> = ({ item, handleDragStart, handleReorder }) => {

    const imageTypes = ['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/x-jps', 'image/png', 'image/gif', 'image/webp'];

    if (item.isFolder) {
        return (<ItemsWrapper
            Icon={Icons.Folder}
            item={item}
            handleDragStart={handleDragStart}
            handleReorder={handleReorder}
        />)
    }

    const mimeType = 'type' in item.details ? item.details.type : '';

    let Icon = Icons.File;

    if (imageTypes.includes(mimeType)) {
        Icon = Icons.Image;
    }

    switch (mimeType) {
        case 'application/pdf':
            Icon = Icons.PDF;
            break;
    }

    return (
        <ItemsWrapper
            Icon={Icon}
            item={item}
            handleDragStart={handleDragStart}
            handleReorder={handleReorder}
        />
    )

}

const ExplorerItems = () => {
    const explorerItems = useAppSelector((state) => state.explorer.explorerItems);
    const currentFolder = useAppSelector((state) => state.explorer.currentFolder);
    const view = useAppSelector((state) => state.explorer.settings.view);

    const item = explorerItems[currentFolder]

    const [draggedItem, setDraggedItem] = useState<FileT | FolderT | null>(null);
    const [files, setFiles] = useState(
        item?.isFolder ? item.children.map((child) => explorerItems[child]) : []
    );

    useEffect(() => {
        if (item?.isFolder) {
            setFiles(item.children.map((child) => explorerItems[child]).sort((a) => a.isFolder ? -1 : 1))
        }
    }, [currentFolder, explorerItems])

    // console.log(files)


    // Handle drag start for internal elements
    const handleDragStart: handleDragStartT = (e, item) => {
        e.dataTransfer.setData("application/json", JSON.stringify(item));
        setDraggedItem(item);
    };

    // Handle reordering items
    const handleReorder: handleReorderT = (e, targetIndex) => {
        e.preventDefault();
        if (!draggedItem) return;

        const updatedFiles = [...files];
        const draggedIndex = updatedFiles.findIndex((file) => file.id === draggedItem.id);

        if (draggedIndex !== -1) {
            updatedFiles.splice(draggedIndex, 1);
            updatedFiles.splice(targetIndex, 0, draggedItem);
        }

        setFiles(updatedFiles);
        setDraggedItem(null);
    };

    // TODO: Complete drag over handler for folders to move files into them
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (item.isFolder) {
            const draggedItem = JSON.parse(e.dataTransfer.getData("application/json")) as FileT | FolderT;
            console.log("Dragged item:", draggedItem);
            console.log("Over folder:", item);
        }
    };


    if (item?.isFolder) {
        return (
            <div className={cn('relative', view === 'row' ? ' w-full' : 'flex gap-2 items-start justify-start flex-wrap w-fit')}>
                {files.map((child, index) => (
                    <SetIcon
                        key={child.id}
                        item={child}
                        handleDragStart={(e) => handleDragStart(e, child)}
                        handleReorder={(e) => handleReorder(e, index)}
                    // handleDragOver={handleDragOver}
                    />
                )
                )}
            </div>
        )
    }
}

export default ExplorerItems