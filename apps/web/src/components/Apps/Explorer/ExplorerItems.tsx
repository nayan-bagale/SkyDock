import { useUpdateItemMutation } from "@/redux/APISlice";
import { moveFileIntoFolder, setItemDragged } from "@/redux/features/explorer/explorerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import cn from "@/utils";
import { handleDragStartT, handleDropT } from "@skydock/types";
import { useMemo } from "react";
import Item from "./Items";

const ExplorerItems = () => {
    const explorerItems = useAppSelector((state) => state.explorer.explorerItems);
    const currentFolder = useAppSelector((state) => state.explorer.currentFolder);
    const view = useAppSelector((state) => state.explorer.settings.view);

    const item = explorerItems[currentFolder]

    const dispatch = useAppDispatch()
    const itemDragged = useAppSelector((state) => state.explorer.itemDragged);
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
            // console.log("Dragged index:", itemDragged.name);
            // console.log("Target index:", droppedItem.name);
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
                    <Item
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