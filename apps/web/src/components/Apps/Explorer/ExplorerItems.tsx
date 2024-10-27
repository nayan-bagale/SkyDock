import useOnClickOutside from "@/components/hooks/useOnclickOutside";
import { FileT, FolderT, setCurrentFolder } from "@/redux/features/explorer/explorerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "@/ui/button";
import { ContextMenu, ContextMenuSeparator } from "@/ui/ContextMenu";
import { DisplayItemsIcons } from "@/ui/DisplayFilesIcons";
import cn from "@/utils";
import { Icons } from "@repo/ui/icons";
import { FC, useRef, useState } from "react";

const ItemsWrapper: FC<{ item: FileT | FolderT, Icon: typeof Icons.Closed_Eye, onClick?: () => void }> =
    ({ item, Icon, onClick }) => {
        const [contextMenu, SetContextMenu] = useState(false);
        // const [position, setPosition] = useState({ x: 0, y: 0 });
        const ref = useRef<HTMLDivElement>(null)
        const dispatch = useAppDispatch()

        const view = useAppSelector((state: any) => state.filesexplorer.view).view

        const position = view === 'grid' ? ' left-4' : ' left-12'

        useOnClickOutside(ref, () => SetContextMenu(false));

        const handleContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>,) => {
            e.preventDefault();
            SetContextMenu(!contextMenu);
            // setPosition({ x: e.clientX, y: e.clientY });
        }

        const handleDelete = () => {
            // dispatch(removeFile(file.id))
        }


        return (
            <div onDoubleClick={onClick}>
                <DisplayItemsIcons view={view} Icon={Icon} item={item} onContextMenu={handleContextMenu} />
                {contextMenu && (
                    <ContextMenu ref={ref} className={position}>
                        <Button size={'menu'} className=" ">
                            Open
                        </Button>
                        <Button size={'menu'} className=" ">
                            Download
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

const FolderIcon: FC<{ folder: FolderT, onClick?: () => void }> = ({ folder, onClick }) => {
    return (
        <ItemsWrapper Icon={Icons.Folder} item={folder} onClick={onClick} />
    )
}

const ExplorerItems = () => {
    const explorerItems = useAppSelector((state) => state.explorer.explorerItems);
    const currentFolder = useAppSelector((state) => state.explorer.currentFolder);
    const view = useAppSelector((state) => state.filesexplorer.view)?.view;

    const dispatch = useAppDispatch()

    const item = explorerItems[currentFolder]


    if (item?.isFolder) {
        return (
            <div className={cn('relative', view === 'row' ? ' w-full' : 'flex gap-2 items-start justify-start flex-wrap w-fit')}>
                {item.children.map((child) => explorerItems[child].isFolder && (
                    <FolderIcon key={explorerItems[child].id} folder={explorerItems[child]} onClick={() => dispatch(setCurrentFolder(explorerItems[child].id))} />
                ))}
                {item.children.map((child) => !explorerItems[child].isFolder && (
                    <FileIcon key={explorerItems[child].id} file={explorerItems[child] as FileT} />
                ))}
            </div>
        )
    }
}

export default ExplorerItems