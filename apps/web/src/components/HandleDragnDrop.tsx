import { addItem, FileT } from '@/redux/features/explorer/explorerSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { DragDropWrapper, DraggedFilesT } from '@/ui/DragDropWrapper'
import { changeBytes } from '@/utils/changeBytes'
import { nanoid } from '@reduxjs/toolkit'
import { FC, ReactNode } from 'react'


const HandleDragnDrop: FC<{ children: ReactNode }> = ({ children }) => {

    const dispatch = useAppDispatch()
    const currentFolder = useAppSelector((state) => state.explorer.currentFolder)

    const handlefiles = (files: DraggedFilesT) => {
        const Arrayfiles = Array.from(files)

        Arrayfiles.forEach((file) => {

            if (file.type === '') return;

            const fileData: FileT = {
                id: nanoid(),
                name: file.name,
                parent: currentFolder,
                isFolder: false,
                details: {
                    name: file.name,
                    size: changeBytes(file.size),
                    type: file.type,
                    lastModified: file.lastModified.toString(),
                    // File: file
                }
            }
            dispatch(addItem(fileData))
        })
    }

    return (
        <DragDropWrapper handlefiles={handlefiles}>
            {children}
        </DragDropWrapper>
    )
}

export default HandleDragnDrop