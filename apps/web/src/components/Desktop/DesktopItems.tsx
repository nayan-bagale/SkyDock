import { useUpdateItemMutation } from "@/redux/apis/filesAndFolderApi";
import { moveFileIntoFolder, setItemDragged } from "@/redux/features/explorer/explorerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { handleDragStartT, handleDropT } from "@skydock/types";
import { useMemo } from "react";
import Item from "./Items";

const DesktopItems = () => {
    const explorerItems = useAppSelector((state) => state.explorer.explorerItems);

    const desktopItem = explorerItems["desktop"];
    const dispatch = useAppDispatch();
    const itemDragged = useAppSelector((state) => state.explorer.itemDragged);
    const [updateFileApi] = useUpdateItemMutation();

    const files = useMemo(() => {
        if (desktopItem?.isFolder) {
            return desktopItem.children.map((child) => explorerItems[child]).sort((a) => a.isFolder ? -1 : 1)
        }
        return []
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [explorerItems])


    // Handle drag start for internal elements
    const handleDragStart: handleDragStartT = (e, item) => {
        // e.dataTransfer.setData("application/json", JSON.stringify(item));
        dispatch(setItemDragged(item));

    };

    // Handle reordering items
    const handleDrop: handleDropT = async (e, droppedItem) => {
        e.preventDefault();
        if (!itemDragged) return;

        if (droppedItem.isFolder && (itemDragged.id !== droppedItem.id)) {
            await updateFileApi({ id: itemDragged.id, parent_id: droppedItem.id });
            dispatch(moveFileIntoFolder({ fileId: itemDragged.id, folderId: droppedItem.id }));
        }


        dispatch(setItemDragged(null));
    };

    return (
        <div className={'relative max-h-[90vh] inline-flex flex-col gap-2 items-start justify-start flex-wrap p-2'}>
            {files.map((child, index) => (
                <Item
                    key={child.id}
                    item={child}
                    handleDragStart={(e) => handleDragStart(e, child)}
                    handleDrop={(e) => handleDrop(e, child, index)}
                />
            ))}
        </div>
    )
}

export default DesktopItems