import { useUpdateItemMutation } from '@/redux/APISlice'
import { moveFileIntoFolder } from '@/redux/features/explorer/explorerSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { DragDropWrapper, DraggedFilesT } from '@/ui/DragDropWrapper'
import { nanoid } from '@reduxjs/toolkit'
import { FolderT } from '@skydock/types'
import { FC, ReactNode } from 'react'
import useFileUploadsAndUpdateState from './hooks/useFileUploadsAndUpdateState'


const HandleDragnDrop: FC<{ children: ReactNode }> = ({ children }) => {

    const currentFolder = useAppSelector((state) => state.explorer.currentFolder)
    const [getUploadUrls] = useFileUploadsAndUpdateState();
    const itemDragged = useAppSelector((state) => state.explorer.itemDragged);
    const explorerItems = useAppSelector((state) => state.explorer.explorerItems);
    const [updateFileApi] = useUpdateItemMutation();
    const dispatch = useAppDispatch()



    const handleExternalfiles = async (files: DraggedFilesT) => {
        const Arrayfiles = Array.from(files)
        const filesObj = Arrayfiles.filter(file => file.type !== '').map((file) => ({
            id: nanoid(),
            isFolder: false as const,
            name: file.name,
            parent: currentFolder,
            details: {
                name: file.name,
                size: file.size.toString(),
                // size_display: changeBytes(file.size),
                type: file.type,
                lastModified: file.lastModified.toString(),
                File: file
            }
        }))

        await getUploadUrls(filesObj)
    }

    const handleInternalFiles = async (e) => {

        if (!itemDragged) return

        const droppedItem = explorerItems[currentFolder] as FolderT

        if (droppedItem.children.includes(itemDragged.id)) return

        await updateFileApi({ id: itemDragged.id, parent_id: droppedItem.id });
        dispatch(moveFileIntoFolder({ fileId: itemDragged.id, folderId: droppedItem.id }));

        console.log(itemDragged)
    }

    return (
        <DragDropWrapper handleExternalfiles={handleExternalfiles} handleInternalFiles={handleInternalFiles}>
            {children}
        </DragDropWrapper>
    )
}

export default HandleDragnDrop