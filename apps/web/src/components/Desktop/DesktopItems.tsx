import { useAppSelector } from "@/redux/hooks";
import { handleDragStartT, handleDropT } from "@skydock/types";
import { useMemo } from "react";
import Item from "../Apps/Explorer/Items";

const DesktopItems = () => {
    const explorerItems = useAppSelector((state) => state.explorer.explorerItems);

    const desktopItem = explorerItems["desktop"];


    const files = useMemo(() => {
        if (desktopItem?.isFolder) {
            return desktopItem.children.map((child) => explorerItems[child]).sort((a) => a.isFolder ? -1 : 1)
        }
        return []
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [explorerItems])

    // console.log(files)

    // Handle drag start for internal elements
    const handleDragStart: handleDragStartT = (e, item) => {
        // e.dataTransfer.setData("application/json", JSON.stringify(item));
        // dispatch(setItemDragged(item));

    };

    // Handle reordering items
    const handleDrop: handleDropT = async (e, droppedItem) => {
        e.preventDefault();
        // if (!itemDragged) return;

        // if (droppedItem.isFolder && (itemDragged.id !== droppedItem.id)) {
        //     // console.log("Dragged index:", itemDragged.name);
        //     // console.log("Target index:", droppedItem.name);
        //     await updateFileApi({ id: itemDragged.id, parent_id: droppedItem.id });
        //     dispatch(moveFileIntoFolder({ fileId: itemDragged.id, folderId: droppedItem.id }));
        // }


        // dispatch(setItemDragged(null));

        // // const updatedFiles = [...files];
        // // const draggedIndex = updatedFiles.findIndex((file) => file.id === itemDragged.id);
        // // if (draggedIndex !== -1) {
        // //     updatedFiles.splice(draggedIndex, 1);
        // //     updatedFiles.splice(targetIndex, 0, draggedItem);
        // // }
        // // setFiles(updatedFiles);
    };

    return (
        <div className={'relative h-full flex gap-2 items-start justify-start flex-wrap w-fit'}>
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