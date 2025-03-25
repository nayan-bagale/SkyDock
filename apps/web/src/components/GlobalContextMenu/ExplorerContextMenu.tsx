import useDeleteFolderRecursively from '@/components/hooks/useDeleteFolderRecursively';
import useFileDownloadWithProgress from '@/components/hooks/useFileDownloadWithProgress';
import { useCreateFolderMutation, useDeleteFileMutation, useDeleteFolderMutation, useUpdateItemMutation } from '@/redux/APISlice';
import { closeContextMenu } from '@/redux/features/contextMenu/contextMenuSlice';
import { addItem, deleteItem, renameItem, setCurrentFolder } from '@/redux/features/explorer/explorerSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Button } from '@/ui/button';
import { ContextMenuSeparator } from '@/ui/ContextMenu';
import { nanoid } from '@reduxjs/toolkit';
import { FolderT } from '@skydock/types';
import { Icons } from '@skydock/ui/icons';
import { useState } from 'react';

interface ExplorerContextMenuProps {
    targetId: string | null;
    additionalData?: any;
}

const ExplorerContextMenu = ({ targetId, additionalData }: ExplorerContextMenuProps) => {
    const dispatch = useAppDispatch();
    const explorerItems = useAppSelector((state) => state.explorer.explorerItems);
    const currentFolder = useAppSelector((state) => state.explorer.explorerItems[state.explorer.currentFolder]) as FolderT;
    const [deleteFile] = useDeleteFileMutation();
    const [deleteFolder] = useDeleteFolderMutation();
    const [getNestedFolderItemsId] = useDeleteFolderRecursively();
    const { downloadFile } = useFileDownloadWithProgress();
    const [updateItem] = useUpdateItemMutation();
    const [createFolder] = useCreateFolderMutation();
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState('');


    // If targetId exists, we're right-clicking on an item
    const targetItem = targetId ? explorerItems[targetId] : null;

    const handleAddFolder = async () => {
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
        };

        try {
            await createFolder(folderObj);
            dispatch(addItem(folderObj));
            dispatch(closeContextMenu());
        } catch (error) {
            console.error('Error creating folder:', error);
        }
    };

    const handleOpen = () => {
        if (targetItem && targetItem.isFolder) {
            dispatch(setCurrentFolder(targetItem.id));
        }
        dispatch(closeContextMenu());
    };

    const handleDelete = async () => {
        if (!targetItem) return;

        try {
            if (targetItem.isFolder) {
                const arrayItems = getNestedFolderItemsId(targetItem.id, [targetItem.id]);
                await deleteFolder(arrayItems);
            } else {
                await deleteFile(targetItem.id);
            }
            dispatch(deleteItem(targetItem));
        } catch (error) {
            console.log(error);
        }

        dispatch(closeContextMenu());
    };

    const handleDownload = async () => {
        if (targetItem && !targetItem.isFolder) {
            await downloadFile(targetItem);
        }
        dispatch(closeContextMenu());
    };

    const handleRename = () => {
        if (!targetItem) return;
        setNewName(targetItem.name);
        setIsRenaming(true);
    };

    const handleRenameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetItem || !newName.trim()) return;
        console.log(targetItem)

        try {
            await updateItem({ id: targetItem.id, name: newName });
            dispatch(renameItem({ id: targetItem.id, name: newName }));
            setIsRenaming(false);
            dispatch(closeContextMenu());
        } catch (error) {
            console.error('Error renaming item:', error);
        }
    };

    // If we're right-clicking on an empty area (no targetId)
    if (!targetItem) {
        return (
            <>
                <Button size={'menu'} onClick={handleAddFolder}>
                    <div>New Folder</div>
                    <Icons.Folder_Add className="h-4" />
                </Button>
                <Button size={'menu'}>
                    <div>Paste</div>
                    {/* <Icons.Clipboard className="h-4" /> */}
                </Button>
            </>
        );
    }

    // If we're renaming
    if (isRenaming) {
        return (
            <form onSubmit={handleRenameSubmit} className="p-1">
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    autoFocus
                    className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm"
                    onBlur={() => setIsRenaming(false)}
                />
                <div className="flex justify-end mt-2">
                    <Button
                        type="button"
                        onClick={() => setIsRenaming(false)}
                        className="mr-2"
                    >
                        Cancel
                    </Button>
                    <Button type="submit">Rename</Button>
                </div>
            </form>
        );
    }

    // If we're right-clicking on an item
    return (
        <>
            {targetItem.isFolder && (
                <Button size={'menu'} onClick={handleOpen}>
                    <div>Open</div>
                </Button>
            )}
            {!targetItem.isFolder && (
                <Button size={'menu'} onClick={handleDownload}>
                    <div>Download</div>
                    <Icons.Download className="h-4" />
                </Button>
            )}
            <Button size={'menu'} onClick={handleRename}>
                <div>Rename</div>
                <Icons.Rename className="h-4" />
            </Button>
            <Button size={'menu'}>
                <div>Copy</div>
                <Icons.Copy className="h-4" />
            </Button>
            {/* <Button size={'menu'}>
                <div>Cut</div>
                <Icons.Cut className="h-4" />
            </Button> */}
            <ContextMenuSeparator />
            <Button size={'menu'} className="hover:bg-red-600" onClick={handleDelete}>
                <div>Delete</div>
                <Icons.Trash3 className="h-4" />
            </Button>
        </>
    );
};

export default ExplorerContextMenu; 