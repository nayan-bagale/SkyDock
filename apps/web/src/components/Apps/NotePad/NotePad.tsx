import useNotePad from "@/components/hooks/apps/useNotePad";
import useChangeAppFocus from "@/components/hooks/useChangeAppFocus";
import { useDrag } from "@/components/hooks/useDrag";
import { closeNotePad } from "@/redux/features/note-pad/notePadSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "@/ui/button";
import NotePadCard from "@/ui/Cards/NodePad/NotePadCard";
import { AppsT } from "@skydock/types/enums";
import { Save } from "lucide-react";
import { useRef, useState } from "react";
import { useDebounce } from "react-use";


const NotePad = () => {
    const theme = useAppSelector((state) => state.settings.apperance.theme);
    const [contentValue, setContentValue] = useState<string>("");
    const dispatch = useAppDispatch();
    const draggableRef = useRef<HTMLDivElement>(null);
    const { position, handleMouseDown } = useDrag({
        ref: draggableRef,
    });
    const { handleAppFocus } = useChangeAppFocus(AppsT.NotePad);
    const isFocused = useAppSelector((state) => state.apps.focusedApp === AppsT.NotePad);
    const action = {
        close: () => {
            dispatch(closeNotePad());
        },
    };

    const { getSyncColor, getSyncText, setContent, syncStatus, syncToCloud } = useNotePad();

    const [isReady, cancel] = useDebounce(() => {
        setContent(contentValue);
    }, 500, [contentValue, setContent]);

    return (
        <NotePadCard
            style={{ x: position.x, y: position.y }}
            ref={draggableRef}
            onMouseDown={handleMouseDown}
            theme={theme}
            action={action}
            isFocused={isFocused}
            onMouseDownCard={handleAppFocus}
            onContextMenu={(e) => {
                e.stopPropagation();
                // Handle context menu if needed
            }}
            title="NotePad"
        >
            <div className="bg-white flex items-center p-1 border-b">
                <Button
                    onClick={syncToCloud}
                    disabled={syncStatus === 'saving'}
                    size={'small'}
                    className={`${getSyncColor()} text-white  px-2 transition-all duration-200 transform hover:scale-105`}
                >
                    {/* {getSyncIcon()} */}
                    <Save className="w-4 h-4" />
                    <span className="ml-2">{getSyncText()}</span>
                </Button>
            </div>
            <div className="bg-white flex-1 overflow-hidden">
                <textarea
                    value={contentValue}
                    onChange={(e) => setContentValue(e.target.value)}
                    placeholder="Start writing your thoughts..."
                    className="w-full h-full p-2 text-slate-700 leading-relaxed text-md resize-none border-none outline-none focus:ring-0 placeholder-slate-400"
                />
            </div>
            {/* Status Bar */}
            <div className=" px-4 py-1 border-t flex items-center justify-between text-sm text-slate-500">
                <div className="flex text-xs items-center space-x-4">
                    <span>{contentValue.length} characters</span>
                    <span>
                        {contentValue.split(/\s+/).filter((word) => word.length > 0).length}{" "}
                        words
                    </span>
                </div>
                <div className=" text-center text-xs text-slate-400">
                    Press <kbd className=" p-1 bg-slate-100 rounded text-slate-600 font-mono">Ctrl + S</kbd> to save
                </div>
                <div className="flex  items-center space-x-2">
                    <div
                        className={`w-2 h-2 rounded-full ${syncStatus === "synced"
                            ? "bg-green-400"
                            : syncStatus === "saving"
                                ? "bg-blue-400 animate-pulse"
                                : syncStatus === "error"
                                    ? "bg-red-400"
                                    : "bg-slate-400"
                            }`}
                    />
                    <span className="text-xs">
                        {syncStatus === "synced"
                            ? "All changes saved"
                            : syncStatus === "saving"
                                ? "Syncing to cloud..."
                                : syncStatus === "error"
                                    ? "Offline - saved locally"
                                    : "Ready to save"}
                    </span>
                </div>
            </div>
        </NotePadCard>
    );
};

export default NotePad;
