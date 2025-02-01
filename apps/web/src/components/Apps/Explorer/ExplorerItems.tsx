import useDeleteFolderRecursively from "@/components/hooks/useDeleteFolderRecursively";
import useFileDownloadWithProgress from "@/components/hooks/useFileDownloadWithProgress";
import useOnClickOutside from "@/components/hooks/useOnclickOutside";
import { useDeleteFileMutation, useDeleteFolderMutation, useUpdateItemMutation } from "@/redux/APISlice";
import { deleteItem, moveFileIntoFolder, renameItem, setCurrentFolder, setItemDragged } from "@/redux/features/explorer/explorerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "@/ui/button";
import { ContextMenu, ContextMenuSeparator } from "@/ui/ContextMenu";
import { DisplayItemsIcons } from "@/ui/DisplayItemsIcons";
import cn from "@/utils";
import { DragEventT, FileT, FolderT, handleDragStartT, handleDropT, MouseEventT } from "@repo/types";
import { Icons } from "@repo/ui/icons";
import { FC, useMemo, useRef, useState } from "react";


interface ItemsPropsT {
    item: FileT | FolderT,
    Icon: typeof Icons.Closed_Eye,
    handleDragStart: MouseEventT;
    handleDrop: DragEventT;
}


const ItemsWrapper: FC<ItemsPropsT> =
    ({ item, Icon, handleDragStart, handleDrop }) => {
        const [contextMenu, SetContextMenu] = useState(false);
        const [deleteFile] = useDeleteFileMutation();
        const [getNestedFolderItemsId] = useDeleteFolderRecursively();
        const [deleteFolder] = useDeleteFolderMutation();
        const { downloadFile } = useFileDownloadWithProgress();
        const [renameItem_] = useUpdateItemMutation();

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
                    handleDrop={handleDrop}
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

const SetIcon: FC<Omit<ItemsPropsT, 'Icon'>> = ({ item, handleDragStart, handleDrop }) => {

    const imageTypes = ['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/x-jps', 'image/png', 'image/gif', 'image/webp'];

    if (item.isFolder) {
        return (<ItemsWrapper
            Icon={Icons.Folder}
            item={item}
            handleDragStart={handleDragStart}
            handleDrop={handleDrop}
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
            handleDrop={handleDrop}
        />
    )

}

const ExplorerItems = () => {
    const explorerItems = useAppSelector((state) => state.explorer.explorerItems);
    const currentFolder = useAppSelector((state) => state.explorer.currentFolder);
    const view = useAppSelector((state) => state.explorer.settings.view);

    const item = explorerItems[currentFolder]

    const dispatch = useAppDispatch()
    const itemDragged = useAppSelector((state) => state.explorer.itemDragged);
    // const [moveFileIntoFolderApi] = useMoveFileIntoFolderMutation();
    const [updateFileApi] = useUpdateItemMutation();

    const files = useMemo(() => {
        if (item?.isFolder) {
            return item.children.map((child) => explorerItems[child]).sort((a) => a.isFolder ? -1 : 1)
        }
        return []
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentFolder, explorerItems])


    // Handle drag start for internal elements
    const handleDragStart: handleDragStartT = (e, item) => {
        e.dataTransfer.setData("application/json", JSON.stringify(item));
        dispatch(setItemDragged(item));

    };

    // Handle reordering items
    const handleDrop: handleDropT = async (e, droppedItem) => {
        e.preventDefault();
        if (!itemDragged) return;

        if (droppedItem.isFolder && (itemDragged.id !== droppedItem.id)) {
            console.log("Dragged index:", itemDragged.name);
            console.log("Target index:", droppedItem.name);
            await updateFileApi({ id: itemDragged.id, parent_id: droppedItem.id });
            dispatch(moveFileIntoFolder({ fileId: itemDragged.id, folderId: droppedItem.id }));
        }


        dispatch(setItemDragged(null));

        // const updatedFiles = [...files];
        // const draggedIndex = updatedFiles.findIndex((file) => file.id === itemDragged.id);
        // if (draggedIndex !== -1) {
        //     updatedFiles.splice(draggedIndex, 1);
        //     updatedFiles.splice(targetIndex, 0, draggedItem);
        // }
        // setFiles(updatedFiles);
    };

    if (item?.isFolder) {
        return (<>
            <div className={cn('relative h-full', view === 'row' ? ' w-full' : 'flex gap-2 items-start justify-start flex-wrap w-fit')}>
                {files.map((child, index) => (
                    <SetIcon
                        key={child.id}
                        item={child}
                        handleDragStart={(e) => handleDragStart(e, child)}
                        handleDrop={(e) => handleDrop(e, child, index)}
                    />
                ))}
            </div>
        </>
        )
    }
}

export default ExplorerItems;