import HandleDragnDrop from "@/components/Files/HandleDragnDrop";
import { useDrag } from "@/components/hooks/useDrag";
import { changeView, FileExplorer, process } from '@/redux/features/apps/app/fileexplorer';
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { FilesExplorerCard } from "@/ui/Cards/FilesExplorer/FilesExplorer";
// import { FilesExplorerCard } from "@repo/ui";

import { useRef } from "react";

const FilesExplorer = () => {

    const dispatch = useAppDispatch()

    const draggableRef = useRef<any>(null);

    const { position, handleMouseDown } = useDrag({
        ref: draggableRef
    });

    const Action = {
        process: () => {
            dispatch(process('off'))
        },
    }

    const navbuttons = {
        func: (v: Pick<FileExplorer, 'view'>) => dispatch(changeView(v)),
        state: useAppSelector((state: any) => state.filesexplorer.view).view
    }


    return (
        <FilesExplorerCard
            ref={draggableRef}
            style={{ x: position.x, y: position.y }}
            onMouseDown={handleMouseDown}
            Action={Action}
            title='CatX'
            navButtons={navbuttons}
        >
            <HandleDragnDrop />
        </FilesExplorerCard>
    )
}

export default FilesExplorer