import HandleDragnDrop from "@/components/HandleDragnDrop";
import { useDrag } from "@/components/hooks/useDrag";
import { changeView, FileExplorer, process } from '@/redux/features/apps/app/fileexplorer';
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { FilesExplorerCard } from "@/ui/Cards/FilesExplorer/FilesExplorer";
// import { FilesExplorerCard } from "@repo/ui";

import useIntializeFilesAndFolders from "@/components/hooks/useIntializeFilesAndFolders";
import { useCreateFolderMutation } from "@/redux/APISlice";
import { setZIndex } from "@/redux/features/apps/appsSlice";
import { addItem, setBackStack, setBreadCrumb, setForwardStack } from "@/redux/features/explorer/explorerSlice";
import { nanoid } from "@reduxjs/toolkit";
import { useRef } from "react";
import ExplorerItems from "./ExplorerItems";

const Explorer = () => {

    const dispatch = useAppDispatch();
    const [createFolder] = useCreateFolderMutation()

    useIntializeFilesAndFolders();

    const draggableRef = useRef<HTMLDivElement>(null);

    const currentFolder = useAppSelector((state) => state.explorer.explorerItems[state.explorer.currentFolder])
    const backStackFoldersName = useAppSelector((state) => state.explorer.backStack.map((id) => ({ id, name: state.explorer.explorerItems[id].name })))
    const backStack = useAppSelector((state) => state.explorer.backStack)
    const forwardStack = useAppSelector((state) => state.explorer.forwardStack)
    const zIndex = useAppSelector((state) => state.apps.zIndex)


    const { position, handleMouseDown } = useDrag({
        ref: draggableRef
    });

    const handleZIndex = () => {
        zIndex !== 'Explorer' && dispatch(setZIndex('Explorer'))
    }

    const addFolder = async () => {
        const folderObj = {
            id: nanoid(),
            isFolder: true,
            name: 'New Folder',
            parent: currentFolder.id,
            details: {
                size: 0,
                lastModified: new Date().toISOString(),
            },
            children: []
        }

        await createFolder(folderObj);

        dispatch(addItem(folderObj))
    }

    const Action = {
        process: () => {
            dispatch(process('off'))
        },
    }

    const settings = {
        func: (v: Pick<FileExplorer, 'view'>) => dispatch(changeView(v)),
        state: useAppSelector((state: any) => state.filesexplorer.view).view
    }

    const handleFolderTree = {
        forward: {
            disabled: forwardStack.length === 0,
            func: () => dispatch(setForwardStack(''))
        },
        backward: {
            disabled: backStack.length === 0,
            backStack: backStackFoldersName,
            func: () => dispatch(setBackStack('')),
            onClickBreadCrumb: (id: string) => dispatch(setBreadCrumb(id))
        },
    }


    return (
        <FilesExplorerCard
            ref={draggableRef}
            style={{ x: position.x, y: position.y }}
            onMouseDown={handleMouseDown}
            Action={Action}
            title={currentFolder.name}
            settings={settings}
            addFolder={addFolder}
            handleFolderTree={handleFolderTree}
            onMouseDownCard={handleZIndex}
            className={zIndex === 'Explorer' ? 'z-20' : ''}
        >
            <HandleDragnDrop>
                <ExplorerItems />
            </HandleDragnDrop>
        </FilesExplorerCard>
    )
}

export default Explorer