import IconByMimeType from "@/components/FileIconByMimeType";
import useAppOpenBasedOnFileType from "@/components/hooks/useAppOpenBasedOnFileType";
import useSoftDeleteItem from "@/components/hooks/useSoftDeleteItem";
import { openContextMenu } from "@/redux/features/contextMenu/contextMenuSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { DisplayItemsIcons } from "@/ui/DisplayItemsIcons";
import { DragEventT, FileT, FolderT, MouseEventT } from "@skydock/types";
import { FC } from "react";

interface ItemPropsT {
    item: FileT | FolderT,
    handleDragStart: MouseEventT;
    handleDrop: DragEventT;
    isSelected?: boolean;
    setSelectedItems?: React.Dispatch<React.SetStateAction<string[]>>;
}


const Item: FC<ItemPropsT> =
    ({ item, handleDragStart, handleDrop, isSelected, setSelectedItems }) => {
        const dispatch = useAppDispatch()

        const { openApp } = useAppOpenBasedOnFileType(item);
        const { handleSoftDelete } = useSoftDeleteItem()

        const view = useAppSelector((state) => state.explorer.settings.view)

        const Icon = IconByMimeType('type' in item.details ? item.details.type : null)


        const handleContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>,) => {
            e.preventDefault();
            e.stopPropagation();
            dispatch(openContextMenu({
                position: { x: e.clientX, y: e.clientY },
                location: 'Explorer',
                targetId: item.id
            }));
        }


        // const handleOpen = () => {
        //     if (item.isFolder) {
        //         dispatch(setCurrentFolder(item.id));
        //     } else if (item.details.type?.startsWith('image/')) {
        //         dispatch(openImageViewer(item.id));
        //     }
        // }

        const handleDoubleClick = () => {
            openApp()
        }


        const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'Enter') {
                openApp()
            } else if (e.key === 'Delete' || e.key === 'Backspace') {
                handleSoftDelete(item)
            }
        }

        return (
            <div className="relative">
                <DisplayItemsIcons
                    view={view}
                    Icon={Icon}
                    item={item}
                    onContextMenu={handleContextMenu}
                    onDoubleClick={handleDoubleClick}
                    onKeyDown={handleKeyDown}
                    handleDragStart={handleDragStart}
                    handleDrop={handleDrop}
                    isSelected={isSelected}
                />
            </div>
        )
    }



export default Item;