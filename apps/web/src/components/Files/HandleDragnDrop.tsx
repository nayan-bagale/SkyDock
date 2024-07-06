import Files from './Files'
import { DragDropWrapper } from '@repo/ui'
import { addFiles } from '@/redux/features/files/filesSlice'
import { nanoid } from '@reduxjs/toolkit'
import { useAppDispatch } from '@/redux/hooks'

const HandleDragnDrop = () => {

    const dispatch = useAppDispatch()

    const handlefiles = (files: File[]) => {
        files.forEach(file => {
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