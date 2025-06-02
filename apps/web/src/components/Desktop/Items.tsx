import IconByMimeType from "@/components/FileIconByMimeType";
import { openContextMenu } from '@/redux/features/contextMenu/contextMenuSlice';
import { openExplorer, setCurrentFolderAndCurrentTab } from "@/redux/features/explorer/explorerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { DisplayItemsIcons } from "@/ui/DisplayItemsIcons";
import { DragEventT, FileT, FolderT, MouseEventT } from "@skydock/types";
import { FC } from "react";
import useAppOpenBasedOnFileType from "../hooks/useAppOpenBasedOnFileType";

interface ItemPropsT {
    item: FileT | FolderT,
    handleDragStart: MouseEventT;
    handleDrop: DragEventT;
}


const Item: FC<ItemPropsT> =
    ({ item, handleDragStart, handleDrop }) => {
        const isExplorerOn = useAppSelector((state) => state.explorer.actions.isProcessOn);
        const dispatch = useAppDispatch()
        const Icon = IconByMimeType('type' in item.details ? item.details.type : null);
        const { openApp } = useAppOpenBasedOnFileType(item);

        const handleContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.preventDefault();
            e.stopPropagation();
            dispatch(openContextMenu({
                position: { x: e.clientX, y: e.clientY },
                location: 'Desktop',
                targetId: item.id
            }));
        }

        const handleOpen = () => {
            if (item.isFolder) {
                if (!isExplorerOn) {
                    dispatch(openExplorer())
                }
                dispatch(setCurrentFolderAndCurrentTab({
                    currentFolder: item.id,
                    activeTab: 'desktop'
                }))
            } else {
                openApp();
            }
        }

        const handleDoubleClick = () => {
            handleOpen();
        }

        const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'Enter') {
                handleOpen()
            }
        }

        return (
            <div className="relative h-fit">
                <DisplayItemsIcons
                    className="text-white"
                    view={'grid'}
                    Icon={Icon}
                    item={item}
                    onContextMenu={handleContextMenu}
                    onDoubleClick={handleDoubleClick}
                    onKeyDown={handleKeyDown}
                    handleDragStart={handleDragStart}
                    handleDrop={handleDrop}
                />
            </div>
        )
    }



export default Item;