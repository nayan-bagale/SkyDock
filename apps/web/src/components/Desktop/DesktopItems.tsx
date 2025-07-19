import { useUpdateItemMutation } from "@/redux/apis/filesAndFolderApi";
import { moveFileIntoFolder, setItemDragged } from "@/redux/features/explorer/explorerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ExplorerItemT, handleDragStartT, handleDropT } from "@skydock/types";
import { showToast } from "@skydock/ui/toast";
import { useCallback, useMemo, useState } from "react";
import Item from "./Items";

const DesktopItems = () => {
    const explorerItems = useAppSelector((state) => state.explorer.explorerItems);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

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


    const onSelectItem = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>, item: ExplorerItemT) => {
        if (event.ctrlKey || event.metaKey) {
            // Toggle selection if Ctrl or Command key is pressed
            setSelectedItems((prev) => {
                if (prev.includes(item.id)) {
                    return prev.filter(id => id !== item.id);
                } else {
                    return [...prev, item.id];
                }
            });

        } else if (event.shiftKey) {
            // Select range of items if Shift key is pressed
            const lastSelectedIndex = selectedItems.length > 0 ? files.findIndex(i => selectedItems.includes(i.id)) : -1;
            const currentIndex = files.findIndex(i => i.id === item.id);
            const newSelectedItems = new Set(selectedItems);
            if (lastSelectedIndex !== -1) {
                const start = Math.min(lastSelectedIndex, currentIndex);
                const end = Math.max(lastSelectedIndex, currentIndex);
                for (let i = start; i <= end; i++) {
                    newSelectedItems.add(files[i].id);
                }
            } else {
                newSelectedItems.add(item.id);
            }
            setSelectedItems(Array.from(newSelectedItems));
        } else {
            // Select single item if no modifier keys are pressed
            setSelectedItems([item.id]);
        }
    }, [files, selectedItems]);



    const onKeydown = useCallback((e: React.KeyboardEvent<HTMLDivElement>, item: ExplorerItemT) => {


    }, []);




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
            try {
                await updateFileApi({ id: itemDragged.id, parent_id: droppedItem.id }).unwrap();
                dispatch(moveFileIntoFolder({ fileId: itemDragged.id, folderId: droppedItem.id }));
            } catch (error) {
                console.error('Error moving item:', error);
                showToast('Error moving item', 'error');
            }
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
                    isSelected={selectedItems.includes(child.id)}
                    onSelectItem={(e) => onSelectItem(e, child)}
                    onKeydown={(e) => onKeydown(e, child)}
                />
            ))}
        </div>
    )
}

export default DesktopItems