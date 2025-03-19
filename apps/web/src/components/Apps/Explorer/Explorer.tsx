import HandleDragnDrop from "@/components/HandleDragnDrop";
import useChangeAppFocus from "@/components/hooks/useChangeAppFocus";
import { useDrag } from "@/components/hooks/useDrag";
import useIntializeFilesAndFolders from "@/components/hooks/useIntializeFilesAndFolders";
import { useCreateFolderMutation } from "@/redux/APISlice";
import { addItem, changeExplorerLastSize, changeExplorerMinimized, changeExplorerSize, changeView, explorerProcess, setActiveTab, setBackStack, setBreadCrumb, setForwardStack } from "@/redux/features/explorer/explorerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import { ExplorerT, FolderT } from "@/types/explorer";
import { ExplorerItemsActiveTabs, ExplorerT, FolderT } from "@skydock/types";

import { ExplorerCard } from "@/ui/Cards/Explorer/Explorer";
import remToPx from "@/utils/rem-to-px";
import { nanoid } from "@reduxjs/toolkit";
import { Icons } from "@skydock/ui/icons";
import { useMemo, useRef } from "react";
import ExplorerItems from "./ExplorerItems";

const Explorer = () => {

    const dispatch = useAppDispatch();
    const [createFolder] = useCreateFolderMutation()

    useIntializeFilesAndFolders();

    const { handleAppFocus } = useChangeAppFocus('Explorer');

    const draggableRef = useRef<HTMLDivElement>(null);

    const currentFolder = useAppSelector((state) => state.explorer.explorerItems[state.explorer.currentFolder])
    const backStack = useAppSelector((state) => state.explorer.backStack)
    const backStackFoldersName = Object.values(useAppSelector((state) => state.explorer.explorerItems)).filter((item) => backStack.includes(item.id)).map((item) => ({ id: item.id, name: item.name }))
    const forwardStack = useAppSelector((state) => state.explorer.forwardStack)
    const focusedApp = useAppSelector((state) => state.apps.focusedApp)
    const activeTab = useAppSelector((state) => state.explorer.activeTab)


    const { position, handleMouseDown } = useDrag({
        ref: draggableRef
    });

    // const handleZIndex = () => {
    //     if (focusedApp !== 'Explorer') dispatch(setFocusedApp('Explorer'))
    // }

    const tabsOptions = useMemo<{
        name: string;
        id: ExplorerItemsActiveTabs;
        Icon: JSX.Element;
    }[]>(() => {
        return [
            { name: 'Root', id: 'root', Icon: <Icons.Cloud className="w-5 h-5" /> },
            // { name: 'Trash', id: 'trash', Icon: <Icons.Trash className="w-5 h-5" /> },
            { name: 'Desktop', id: 'desktop', Icon: <Icons.Folder className="w-5 h-5" /> },
        ]
    }, [])

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
        close: () => { dispatch(explorerProcess(false)); },
        size: {
            isMaximized: useAppSelector((state) => state.explorer.actions.isMaximized),
            lastSize: useAppSelector((state) => state.explorer.actions.lastSize),
            changeSize: function () {
                if (!this.isMaximized) {
                    dispatch(changeExplorerLastSize({ width: draggableRef.current?.clientWidth, height: draggableRef.current?.clientHeight }))
                } else {
                    dispatch(changeExplorerLastSize({ width: remToPx(40), height: remToPx(26) }))
                }
                dispatch(changeExplorerSize())

            },
        },
        minimize: () => dispatch(changeExplorerMinimized()),
    }

    const settings = {
        view: {
            func: (v: ExplorerT['settings']['view']) => dispatch(changeView(v)),
            state: useAppSelector((state) => state.explorer.settings.view)
        }
    }

    const handleFolderTree = {
        forward: {
            disabled: forwardStack.length === 0,
            func: () => dispatch(setForwardStack())
        },
        backward: {
            disabled: backStack.length === 0,
            backStack: backStackFoldersName,
            func: () => dispatch(setBackStack()),
            onClickBreadCrumb: (id: string) => dispatch(setBreadCrumb(id))
        },
    }

    const handleActiveTabs = {
        func: (tab: ExplorerT['activeTab']) => dispatch(setActiveTab(tab)),
        activeTab,
        tabsOptions,
    }

    const theme = useAppSelector((state) => state.settings.apperance.theme)

    // const lastpostion = {
    //     width: draggableRef.current?.clientWidth,
    //     height: draggableRef.current?.clientHeight
    // }


    return (
        <ExplorerCard
            ref={draggableRef}
            style={{ x: position.x, y: position.y }}
            onMouseDown={handleMouseDown}
            action={Action}
            currentFolder={currentFolder as FolderT}
            settings={settings}
            addFolder={addFolder}
            handleFolderTree={handleFolderTree}
            onMouseDownCard={handleAppFocus}
            handleActiveTabs={handleActiveTabs}
            className={focusedApp === 'Explorer' ? 'z-20' : ''}
            theme={theme}

        >
            <HandleDragnDrop>
                <ExplorerItems />
            </HandleDragnDrop>
        </ExplorerCard>
    )
}

export default Explorer