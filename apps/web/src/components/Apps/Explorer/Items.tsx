import IconByMimeType from "@/components/FileIconByMimeType";
import useDeleteFolderRecursively from "@/components/hooks/useDeleteFolderRecursively";
import useFileDownloadWithProgress from "@/components/hooks/useFileDownloadWithProgress";
import useOnClickOutside from "@/components/hooks/useOnclickOutside";
import { useDeleteFileMutation, useDeleteFolderMutation, useUpdateItemMutation } from "@/redux/APISlice";
import { deleteItem, renameItem, setCurrentFolder } from "@/redux/features/explorer/explorerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "@/ui/button";
import { ContextMenu, ContextMenuSeparator } from "@/ui/ContextMenu";
import { DisplayItemsIcons } from "@/ui/DisplayItemsIcons";
import { DragEventT, FileT, FolderT, MouseEventT } from "@skydock/types";
import { Icons } from "@skydock/ui/icons";
import { FC, useRef, useState } from "react";

interface ItemPropsT {
    item: FileT | FolderT,
    handleDragStart: MouseEventT;
    handleDrop: DragEventT;
}


const Item: FC<ItemPropsT> =
    ({ item, handleDragStart, handleDrop }) => {
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

        const Icon = IconByMimeType('type' in item.details ? item.details.type : null)

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
                dispatch(deleteItem(item))
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
                            <div> Download</div>
                            <Icons.Download className=" h-4" />
                        </Button>}
                        <Button size={'menu'} className=" " onClick={handleRename}>
                            <div>Rename</div>
                            <Icons.Rename className=" h-4" />

                        </Button>
                        <Button size={'menu'} className=" ">
                            <div>Move to</div>
                            <Icons.Move className=" h-4" />
                        </Button>
                        {!(item.isFolder) && <Button size={'menu'} className=" ">
                            <div>Make copy</div>
                            <Icons.Copy className=" h-4" />
                        </Button>}
                        <ContextMenuSeparator />
                        <Button size={'menu'} className=" hover:bg-red-600" onClick={handleDelete}>
                            <div>Delete</div>
                            <Icons.Trash3 className=" h-4" />
                        </Button>
                    </ContextMenu>
                )}
            </div>
        )
    }



export default Item;