import { setItemDragged } from "@/redux/features/explorer/explorerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";

const DraggingItem = () => {
    const dispatch = useAppDispatch();

    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const itemDragged = useAppSelector((state) => state.explorer.itemDragged);

    useEffect(() => {
        const handleDragMove = (event: DragEvent) => {
            setCursorPos({ x: event.clientX, y: event.clientY });
        };

        const handleDragEnd = () => {
            dispatch(setItemDragged(null));
        };

        document.addEventListener("dragover", handleDragMove);
        document.addEventListener("dragend", handleDragEnd);
        document.addEventListener("drop", handleDragEnd); // Ensure it disappears when dropped anywhere

        return () => {
            document.removeEventListener("dragover", handleDragMove);
            document.removeEventListener("dragend", handleDragEnd);
            document.removeEventListener("drop", handleDragEnd);
        };
    }, []);

    if (!itemDragged) return null;
    return (
        <div
            className="fixed z-50 pointer-events-none p-2 bg-white border shadow-lg rounded-md flex items-center gap-2"
            style={{
                top: cursorPos.y,
                left: cursorPos.x,
                transform: "translate(-50%, -50%)",
            }}
        >
            📄 <span className="font-semibold">{itemDragged.name}</span>
        </div>
    )
}

export default DraggingItem