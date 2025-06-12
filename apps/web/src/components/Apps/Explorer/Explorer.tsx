import DragnDropWrapper_Explorer from "@/components/Wrappers/DragnDropWrapper_Explorer";
import useChangeAppFocus from "@/components/hooks/useChangeAppFocus";
import useDeleteFolderRecursively from "@/components/hooks/useDeleteFolderRecursively";
import { useDrag } from "@/components/hooks/useDrag";
import { useInvalidApi } from "@/components/hooks/useInvalidApis";
import { useCreateFolderMutation, useDeleteFolderMutation } from "@/redux/apis/filesAndFolderApi";
import { openContextMenu } from '@/redux/features/contextMenu/contextMenuSlice';
import { addItem, changeExplorerLastSize, changeExplorerMinimized, changeExplorerSize, changeView, emptyTrash, explorerProcess, setActiveTab, setBackStack, setBreadCrumb, setForwardStack } from "@/redux/features/explorer/explorerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ExplorerCard } from "@/ui/Cards/Explorer/Explorer";
import remToPx from "@/utils/rem-to-px";
import { nanoid } from "@reduxjs/toolkit";
import { ExplorerItemsActiveTabs, ExplorerT, FolderT } from "@skydock/types";
import { ExplorerTabs } from "@skydock/types/enums";
import { Icons } from "@skydock/ui/icons";
import { showToast } from "@skydock/ui/toast";
import { useMemo, useRef } from "react";
import ExplorerItems from "./ExplorerItems";

const Explorer = () => {

    const dispatch = useAppDispatch();
    const [createFolder] = useCreateFolderMutation()
    const [emptyTrashApi] = useDeleteFolderMutation();
    const { invalidUserInfo } = useInvalidApi();

    const { handleAppFocus } = useChangeAppFocus('Explorer');

    const draggableRef = useRef<HTMLDivElement>(null);

    const explorerItems = useAppSelector((state) => state.explorer.explorerItems)
    const currentFolder = useAppSelector((state) => state.explorer.explorerItems[state.explorer.currentFolder]) as FolderT
    const backStack = useAppSelector((state) => state.explorer.backStack)
    const backStackFoldersName = Object.values(useAppSelector((state) => state.explorer.explorerItems)).filter((item) => backStack.includes(item.id)).map((item) => ({ id: item.id, name: item.name }))
    const forwardStack = useAppSelector((state) => state.explorer.forwardStack)
    const focusedApp = useAppSelector((state) => state.apps.focusedApp)
    const activeTab = useAppSelector((state) => state.explorer.activeTab)
    const { getNestedFolderItemsId } =
        useDeleteFolderRecursively();

    const { position, handleMouseDown } = useDrag({
        ref: draggableRef
    });

    const tabsOptions = useMemo<{
        name: string;
        id: ExplorerItemsActiveTabs;
        Icon: JSX.Element;
    }[]>(() => {
        return [
            { name: 'Sky-Drive', id: 'skydrive', Icon: <Icons.Cloud className="w-5 h-5" /> },
            // { name: 'Trash', id: 'trash', Icon: <Icons.Trash className="w-5 h-5" /> },
            { name: 'Desktop', id: 'desktop', Icon: <Icons.Folder className="w-5 h-5" /> },
        ]
    }, [])

    const handleEmptyTrash = async () => {
        const arrayItems = getNestedFolderItemsId('trash', []).filter((item: any) => !ExplorerTabs.includes(item));
        try {
            await emptyTrashApi(arrayItems);
            invalidUserInfo();
            dispatch(emptyTrash());
        } catch (e) {
            showToast('Internal Server Error', 'error')
        }
    };

    const addFolder = async () => {
        // Get all folders in current directory
        const currentFolderChildren = currentFolder.children;
        const existingFolders = Object.values(explorerItems)
            .filter(item => currentFolderChildren.includes(item.id));

        // Generate new folder name
        let newFolderName = 'New Folder';
        let counter = 1;

        while (existingFolders.some(folder => folder.name === newFolderName)) {
            newFolderName = `New Folder (${counter})`;
            counter++;
        }

        const folderObj = {
            id: nanoid(),
            isFolder: true,
            name: newFolderName,
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
            func: (v: ExplorerT['settings']['view']) => { dispatch(changeView(v)) },
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


    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(openContextMenu({
            position: { x: e.clientX, y: e.clientY },
            location: 'Explorer',
            additionalData: { currentFolder }
        }));
    };

    return (
        <ExplorerCard
            ref={draggableRef}
            style={{ x: position.x, y: position.y }}
            onMouseDown={handleMouseDown}
            action={Action}
            currentFolder={currentFolder}
            settings={settings}
            addFolder={addFolder}
            handleFolderTree={handleFolderTree}
            onMouseDownCard={handleAppFocus}
            handleActiveTabs={handleActiveTabs}
            // className={focusedApp === 'Explorer' ? 'z-20' : ''}
            isFocused={focusedApp === 'Explorer'}
            theme={theme}
            onContextMenu={handleContextMenu}
            onEmptyTrash={handleEmptyTrash}
        >
            <DragnDropWrapper_Explorer>
                <ExplorerItems />
            </DragnDropWrapper_Explorer>
        </ExplorerCard>
    )
}

export default Explorer