import useFileDownloadWithProgress from "@/components/hooks/useFileDownloadWithProgress";
import useOnClickOutside from "@/components/hooks/useOnclickOutside";
import { useDeleteFileMutation, useRenameItemMutation } from "@/redux/APISlice";
import { deleteItem, FileT, FolderT, renameItem, setCurrentFolder } from "@/redux/features/explorer/explorerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "@/ui/button";
import { ContextMenu, ContextMenuSeparator } from "@/ui/ContextMenu";
import { DisplayItemsIcons } from "@/ui/DisplayFilesIcons";
import cn from "@/utils";
import { Icons } from "@repo/ui/icons";
import { FC, useRef, useState } from "react";

const ItemsWrapper: FC<{ item: FileT | FolderT, Icon: typeof Icons.Closed_Eye }> =
    ({ item, Icon }) => {
        const [contextMenu, SetContextMenu] = useState(false);
        // const [position, setPosition] = useState({ x: 0, y: 0 });
        const [deleteFile] = useDeleteFileMutation();
        const { downloadFile } = useFileDownloadWithProgress();
        const [renameItem_] = useRenameItemMutation();

        const ref = useRef<HTMLDivElement>(null)
        const dispatch = useAppDispatch()

        const [editing, setEditing] = useState(false)
        const [name, setName] = useState(item.name)

        const rename = {
            editing,
            setEditing,
            name,
            setName
        }

        const view = useAppSelector((state) => state.filesexplorer.view)

        const position = view === 'grid' ? ' left-4' : ' left-12'

        useOnClickOutside(ref, () => SetContextMenu(false));

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
                await deleteFile(item.id)
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
                />
                {contextMenu && (
                    <ContextMenu ref={ref} className={position}>
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

const FileIcon: FC<{ file: FileT }> = ({ file }) => {

    const imageTypes = ['image/jpeg', 'image/jpg', 'image/pjpeg', 'image/x-jps', 'image/png', 'image/gif', 'image/webp'];

    if (imageTypes.includes(file.details.type)) {
        return (<ItemsWrapper Icon={Icons.Image} item={file} />);
    }

    switch (file.details.type) {
        case 'application/pdf':
            return (<ItemsWrapper Icon={Icons.PDF} item={file} />);
        default:
            return (<ItemsWrapper Icon={Icons.File} item={file} />);
    }

}

const FolderIcon: FC<{ folder: FolderT }> = ({ folder }) => {
    return (
        <ItemsWrapper Icon={Icons.Folder} item={folder} />
    )
}

const ExplorerItems = () => {
    const explorerItems = useAppSelector((state) => state.explorer.explorerItems);
    const currentFolder = useAppSelector((state) => state.explorer.currentFolder);
    const view = useAppSelector((state) => state.filesexplorer.view);

    const item = explorerItems[currentFolder]


    if (item?.isFolder) {
        return (
            <div className={cn('relative', view === 'row' ? ' w-full' : 'flex gap-2 items-start justify-start flex-wrap w-fit')}>
                {item.children.map((child) => explorerItems[child].isFolder && (
                    <FolderIcon key={explorerItems[child].id} folder={explorerItems[child]} />
                ))}
                {item.children.map((child) => !explorerItems[child].isFolder && (
                    <FileIcon key={explorerItems[child].id} file={explorerItems[child] as FileT} />
                ))}
            </div>
        )
    }
}

export default ExplorerItems