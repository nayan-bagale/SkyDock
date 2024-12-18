import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { DragDropWrapper, DraggedFilesT } from '@/ui/DragDropWrapper'
import { nanoid } from '@reduxjs/toolkit'
import { FC, ReactNode } from 'react'
import useFileUploads from './hooks/useFileUploads'


const HandleDragnDrop: FC<{ children: ReactNode }> = ({ children }) => {

    const dispatch = useAppDispatch()
    const currentFolder = useAppSelector((state) => state.explorer.currentFolder)
    const [getUploadUrls] = useFileUploads();

    const handlefiles = async (files: DraggedFilesT) => {
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

    return (
        <DragDropWrapper handlefiles={handlefiles}>
            {children}
        </DragDropWrapper>
    )
}

export default HandleDragnDrop