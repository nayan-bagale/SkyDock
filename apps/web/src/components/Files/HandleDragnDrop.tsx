import { addFiles, FileT } from '@/redux/features/files/filesSlice'
import { useAppDispatch } from '@/redux/hooks'
import { nanoid } from '@reduxjs/toolkit'
import { DragDropWrapper } from '@repo/ui'
import Files from './Files'

const HandleDragnDrop = () => {

    const dispatch = useAppDispatch()

    const handlefiles = (files: FileT[]) => {
        files.forEach((file: FileT) => {
            const fileData = {
                id: nanoid(),
                name: file.name,
                size: file.size,
                type: file.type,
                lastModifiedDate: file.lastModifiedDate.toString(),
                File: file
            }
            dispatch(addFiles(fileData))
        })
    }

    return (
        <DragDropWrapper handlefiles={handlefiles}>
            <Files />
        </DragDropWrapper>
    )
}

export default HandleDragnDrop