import { setItemDragged } from "@/redux/features/explorer/explorerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import IconByMimeType from "./FileIconByMimeType";


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

        const handleDragStart = (event: DragEvent) => {
            const img = new Image();
            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
            if (event.dataTransfer) {
                event.dataTransfer.setDragImage(img, 0, 0);
            }
        }

        document.addEventListener("dragover", handleDragMove);
        document.addEventListener("dragend", handleDragEnd);
        document.addEventListener("drop", handleDragEnd); // Ensure it disappears when dropped anywhere
        // document.addEventListener("dragstart", handleDragStart, false);

        return () => {
            document.removeEventListener("dragover", handleDragMove);
            document.removeEventListener("dragend", handleDragEnd);
            document.removeEventListener("drop", handleDragEnd);
            // document.removeEventListener("dragstart", handleDragStart, false);
        };
    }, []);

    if (!itemDragged) return null;

    const Icon = IconByMimeType('type' in itemDragged.details ? itemDragged.details.type : null)

    return null;
    // return (
    //     <div
    //         className={cn(
    //             ' fixed z-50 w-fit flex flex-col justify-center items-center p-1 rounded-md ',
    //         )}
    //         style={{
    //             top: cursorPos.y,
    //             left: cursorPos.x,
    //             transform: "translate(-50%, -50%)",
    //         }}
    //     >
    //         <Icon className="w-16" />
    //         <p className={cn('text-[14px] relative cursor-default text-center select-none ', 'truncate h-7 w-[11ch] overflow-hidden')}>{itemDragged.name}</p>

    //     </div>
    // )
    // return (
    //     <div
    //         className="fixed z-50 pointer-events-none p-2 bg-white border shadow-lg rounded-md flex items-center gap-2"
    //         style={{
    //             top: cursorPos.y,
    //             left: cursorPos.x,
    //             transform: "translate(-50%, -50%)",
    //         }}
    //     >
    //         📄 <span className="font-semibold">{itemDragged.name}</span>
    //     </div>
    // )
}

export default DraggingItem