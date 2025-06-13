import useChangeAppFocus from "@/components/hooks/useChangeAppFocus";
import { useDrag } from "@/components/hooks/useDrag";
import { useAppSelector } from "@/redux/hooks";
import NotePadCard from "@/ui/Cards/NodePad/NotePadCard";
import { AppsT } from "@skydock/types/enums";
import { useRef } from "react";

const NotePad = () => {
    const theme = useAppSelector((state) => state.settings.apperance.theme);

    const draggableRef = useRef<HTMLDivElement>(null);
    const { position, handleMouseDown } = useDrag({
        ref: draggableRef
    });
    const { handleAppFocus } = useChangeAppFocus(AppsT.NotePad);

    const action = {
        close: () => {
            // Close the image viewer
            // You'll need to add this action to your apps slice
            // dispatch(closePdfReader());

        },
    };
    return (
        <NotePadCard
            style={{ x: position.x, y: position.y }}
            ref={draggableRef}
            onMouseDown={handleMouseDown}
            theme={theme}
            action={action}
            isFocused={true}
            onMouseDownCard={handleAppFocus}
            onContextMenu={(e) => {
                e.stopPropagation();
                // Handle context menu if needed
            }}
            title="NotePad"
        >
            <div className="p-4">
                <h1 className="text-xl font-bold mb-4">NotePad</h1>
                <textarea
                    className="w-full h-full p-2 border rounded"
                    placeholder="Type your notes here..."
                />
            </div>
        </NotePadCard>
    )
}

export default NotePad