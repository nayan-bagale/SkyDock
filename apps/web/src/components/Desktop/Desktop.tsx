import { useUpdateItemMutation } from "@/redux/apis/filesAndFolderApi";
import { openContextMenu } from "@/redux/features/contextMenu/contextMenuSlice";
import {
    moveFileIntoFolder,
    setItemDragged,
} from "@/redux/features/explorer/explorerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { DraggedFilesT } from "@/ui/DragDropWrapper";
import { nanoid } from "@reduxjs/toolkit";
import { FolderT, PatchItemRequest } from "@skydock/types";
import useFileUploadsAndUpdateState from "../hooks/useFileUploadsAndUpdateState";
import DragnDropWrapper_Desktop from "../Wrappers/DragnDropWrapper_Desktop";
import DesktopItems from "./DesktopItems";

interface DesktopProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const Desktop = ({ children }: DesktopProps) => {
    const dispatch = useAppDispatch();

    const itemDragged = useAppSelector((state) => state.explorer.itemDragged);
    const desktopItem = useAppSelector(
        (state) => state.explorer.explorerItems["desktop"]
    ) as FolderT;
    const [updateFileApi] = useUpdateItemMutation();
    const [getUploadUrls] = useFileUploadsAndUpdateState();


    const handleExternalfiles = async (files: DraggedFilesT) => {
        const Arrayfiles = Array.from(files)
        const filesObj = Arrayfiles.filter((file) => file.type !== "").map(
            (file) => ({
                id: nanoid(),
                isFolder: false as const,
                name: file.name,
                parent: "desktop",
                details: {
                    name: file.name,
                    size: file.size.toString(),
                    // size_display: changeBytes(file.size),
                    type: file.type,
                    lastModified: file.lastModified.toString(),
                    File: file,
                },
            })
        );

        await getUploadUrls(filesObj);
    }

    const handleInternalFiles = async (e: any) => {
        if (!itemDragged) return;
        if (desktopItem.children.includes(itemDragged.id)) return;

        const requestBody: PatchItemRequest = {
            id: itemDragged.id,
            parent_id: desktopItem.id,
            is_deleted: false,
            deletedAt: null,
        };

        await updateFileApi(requestBody);

        dispatch(
            moveFileIntoFolder({ fileId: itemDragged.id, folderId: desktopItem.id })
        );
        dispatch(setItemDragged(null));
    }


    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(
            openContextMenu({
                position: { x: e.clientX, y: e.clientY },
                location: "Desktop",
                additionalData: { desktopItem },
            })
        );
    };

    return (
        <DragnDropWrapper_Desktop
            DesktopItems={DesktopItems}
            handleExternalfiles={handleExternalfiles}
            handleInternalFiles={handleInternalFiles}
            onContextMenu={handleContextMenu}
        >
            {children}
        </DragnDropWrapper_Desktop>
    );
};

export default Desktop;
