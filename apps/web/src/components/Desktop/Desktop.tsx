import { useUpdateItemMutation } from "@/redux/apis/filesAndFolderApi";
import { openContextMenu } from '@/redux/features/contextMenu/contextMenuSlice';
import { moveFileIntoFolder, setItemDragged } from "@/redux/features/explorer/explorerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { onDropTweak } from "@/tweaks/ElementEvent";
import cn from "@/utils";
import { nanoid } from "@reduxjs/toolkit";
import { FolderT, PatchItemRequest } from "@skydock/types";
import { useCallback, useState } from "react";
import useFileUploadsAndUpdateState from "../hooks/useFileUploadsAndUpdateState";
import DesktopItems from "./DesktopItems";

interface DesktopProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const Desktop = ({ children }: DesktopProps) => {
    const dispatch = useAppDispatch();
    const [isOver, setIsOver] = useState(false);
    const isGuestMode = useAppSelector((state) => state.auth.guestMode);

    const itemDragged = useAppSelector((state) => state.explorer.itemDragged);
    const desktopItem = useAppSelector((state) => state.explorer.explorerItems["desktop"]) as FolderT;
    const [updateFileApi] = useUpdateItemMutation();
    const [getUploadUrls, uploadGuestModeFiles] = useFileUploadsAndUpdateState();


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
            const Arrayfiles = Array.from(e.dataTransfer.files)
            const filesObj = Arrayfiles.filter(file => file.type !== '').map((file) => ({
                id: nanoid(),
                isFolder: false as const,
                name: file.name,
                parent: 'desktop',
                details: {
                    name: file.name,
                    size: file.size.toString(),
                    // size_display: changeBytes(file.size),
                    type: file.type,
                    lastModified: file.lastModified.toString(),
                    File: file
                }
            }))


            uploadGuestModeFiles(filesObj);

            await getUploadUrls(filesObj)

        } else {

            if (!itemDragged) return;
            if (desktopItem.children.includes(itemDragged.id)) return;

            const requestBody: PatchItemRequest = {
                id: itemDragged.id,
                parent_id: desktopItem.id,
                is_deleted: false,
                deletedAt: null
            }


            await updateFileApi(requestBody);


            dispatch(moveFileIntoFolder({ fileId: itemDragged.id, folderId: desktopItem.id }));
            dispatch(setItemDragged(null));
        }


        setIsOver(false); // ✅ Ensure highlight is removed after dropping
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(openContextMenu({
            position: { x: e.clientX, y: e.clientY },
            location: 'desktop',
            additionalData: { desktopItem }
        }));
    };

    return (
        <div
            className={cn("flex-1 w-full", (isOver && 'border-2 m-1 rounded-2xl border-dashed bg-white/20 border-gray-400'))}
            onDragOver={handleDragOverInner}
            onDragLeave={handleDragLeaveInner}
            onDrop={(e) => onDropTweak(e, handleDrop)}
            onDragEnter={handleDragEnter}
            onContextMenu={handleContextMenu}
        >
            {!isOver && <DesktopItems />}
            {/* {isOver && <div className='z-50 absolute inset-0 flex justify-center items-center bg-white/20 backdrop-blur'>
                <p className='text-gray-400 text-lg'>Drop here</p>
            </div>} */}
            {children}

        </div>
    );
};

export default Desktop;
