import HandleDragnDrop from "@/components/HandleDragnDrop";
import { useDrag } from "@/components/hooks/useDrag";
import { changeView, FileExplorer, process } from '@/redux/features/apps/app/fileexplorer';
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { FilesExplorerCard } from "@/ui/Cards/FilesExplorer/FilesExplorer";
// import { FilesExplorerCard } from "@repo/ui";

import { setBackStack, setForwardStack } from "@/redux/features/explorer/explorerSlice";
import { useRef } from "react";
import ExplorerItems from "./ExplorerItems";

const Explorer = () => {

    const dispatch = useAppDispatch()

    const draggableRef = useRef<any>(null);

    const currentFolder = useAppSelector((state) => state.explorer.explorerItems[state.explorer.currentFolder].name)
    const backStack = useAppSelector((state) => state.explorer.backStack)
    const forwardStack = useAppSelector((state) => state.explorer.forwardStack)

    const title = currentFolder === 'root' ? 'CatX' : currentFolder

    const { position, handleMouseDown } = useDrag({
        ref: draggableRef
    });

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
            func: () => dispatch(setBackStack(''))
        },
    }


    return (
        <FilesExplorerCard
            ref={draggableRef}
            style={{ x: position.x, y: position.y }}
            onMouseDown={handleMouseDown}
            Action={Action}
            title={title}
            settings={settings}
            handleFolderTree={handleFolderTree}
        >
            <HandleDragnDrop>
                <ExplorerItems />
            </HandleDragnDrop>
        </FilesExplorerCard>
    )
}

export default Explorer