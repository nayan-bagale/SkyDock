import { onDropTweak } from "@/tweaks/ElementEvent";
import cn from "@/utils";
import { FC, ReactNode, useCallback, useState } from "react";

export type DraggedFilesT = Pick<React.DragEvent<HTMLDivElement>, 'dataTransfer'>['dataTransfer']['files']


interface DragDropWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: ReactNode
    handleExternalfiles: (files: DraggedFilesT) => void
    handleInternalFiles: (e: React.DragEvent<HTMLDivElement>) => void
    DesktopItems: () => JSX.Element
}

const DragnDropWrapper_Desktop: FC<DragDropWrapperProps> = ({ children, DesktopItems, handleExternalfiles, handleInternalFiles, ...props }) => {
    const [isOver, setIsOver] = useState(false);

    const handleDragOverInner = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        // setIsOver(true); // Set highlight when a file is dragged over
        if (!isOver && (e.dataTransfer.types.includes("Files") && (e.dataTransfer.types.length === 1))) {
            setIsOver(true);
        }

    };

    const handleDragLeaveInner = (e: React.DragEvent<HTMLDivElement>) => {
        const target = e.relatedTarget as HTMLElement | null;
        // Only set dragging false if the drag leaves the drop zone
        if (!target || !target.closest('.drop-zone')) {
            setIsOver(false);
        }

    };

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        // Only set dragging true if the drag is from outside the browser
        if (e.dataTransfer.types.includes("Files") && (e.dataTransfer.types.length === 1)) {
            setIsOver(true);
        }
    }, [])


    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {

        // Only call handlefiles if the drag is from outside the browser
        if (e.dataTransfer.types.includes("Files") && (e.dataTransfer.types.length === 1)) {

            handleExternalfiles(e.dataTransfer.files);

        } else {
            handleInternalFiles(e);
        }


        setIsOver(false); // ✅ Ensure highlight is removed after dropping
    };

    return (
        <div
            className={cn("flex-1 w-full", (isOver && 'border-2 m-1 rounded-2xl border-dashed bg-white/20 border-gray-400'))}
            onDragOver={handleDragOverInner}
            onDragLeave={handleDragLeaveInner}
            onDrop={(e) => onDropTweak(e, handleDrop)}
            onDragEnter={handleDragEnter}
            {...props}
        >
            {!isOver && <DesktopItems />}
            {/* {isOver && <div className='z-50 absolute inset-0 flex justify-center items-center bg-white/20 backdrop-blur'>
                <p className='text-gray-400 text-lg'>Drop here</p>
            </div>} */}
            {children}

        </div>
    );
}

export default DragnDropWrapper_Desktop