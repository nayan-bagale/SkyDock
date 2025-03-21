import { moveFileIntoFolder } from "@/redux/features/explorer/explorerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import DesktopItems from "./DesktopItems";

interface DesktopProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const Desktop = ({ children }: DesktopProps) => {
    const dispatch = useAppDispatch();

    const itemDragged = useAppSelector((state) => state.explorer.itemDragged);

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        console.log(e.target);
        if (!itemDragged) return;

        const droppedItem = e.target as HTMLElement;
        // console.log(droppedItem);

        if (droppedItem && itemDragged.id !== droppedItem.id) {
            // console.log("Dragged index:", itemDragged.name);
            // console.log("Target index:", droppedItem.id);
            // await updateFileApi({ id: itemDragged.id, parent_id: droppedItem.id });
            dispatch(
                moveFileIntoFolder({ fileId: itemDragged.id, folderId: droppedItem.id })
            );
        }

        // dispatch(setItemDragged(null));
    };



    return (
        <div
            className="flex-1 w-full"
            id="desktop"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            <DesktopItems />
            {children}
        </div>
    );
};

export default Desktop;
