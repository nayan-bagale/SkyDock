import { moveFileIntoFolder, setItemDragged } from "@/redux/features/explorer/explorerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { onDropTweak } from "@/tweaks/ElementEvent";
import cn from "@/utils";
import { FolderT } from "@skydock/types";
import { useState } from "react";
import DesktopItems from "./DesktopItems";

interface DesktopProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const Desktop = ({ children }: DesktopProps) => {
    const dispatch = useAppDispatch();
    const [isOver, setIsOver] = useState(false);

    const itemDragged = useAppSelector((state) => state.explorer.itemDragged);
    const desktopItem = useAppSelector((state) => state.explorer.explorerItems["desktop"]) as FolderT;

    const handleDragOverInner = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsOver(true); // Set highlight when a file is dragged over

    };

    const handleDragLeaveInner = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false); // Remove highlight when the file leaves the folder

    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false); // ✅ Ensure highlight is removed after dropping
        if (!itemDragged) return;
        if (desktopItem.children.includes(itemDragged.id)) return;

        dispatch(moveFileIntoFolder({ fileId: itemDragged.id, folderId: desktopItem.id }));
        dispatch(setItemDragged(null));
    };



    return (
        <div
            className={cn("flex-1 w-full", isOver && "bg-gray-200")}
            onDragOver={handleDragOverInner}
            onDragLeave={handleDragLeaveInner}
            onDrop={(e) => onDropTweak(e, handleDrop)}
        >
            <DesktopItems />
            {children}
        </div>
    );
};

export default Desktop;
