import { useUpdateItemMutation } from '@/redux/apis/filesAndFolderApi';
import { closeContextMenu } from '@/redux/features/contextMenu/contextMenuSlice';
import { copyToClipboard, renameItem } from '@/redux/features/explorer/explorerSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Button } from '@/ui/button';
import { ContextMenuSeparator } from '@/ui/ContextMenu';
import SupportedMimeTypeCheck from '@/utils/supportedMimeTypeCheck';
import { FolderT } from '@skydock/types';
import { Icons } from '@skydock/ui/icons';
import { useState } from 'react';
import useContextMenu from '../hooks/useContextMenu';

interface ExplorerContextMenuProps {
    targetId: string | null;
    additionalData?: any;
}

const ExplorerContextMenu = ({ targetId, additionalData }: ExplorerContextMenuProps) => {
    const dispatch = useAppDispatch();
    const explorerItems = useAppSelector((state) => state.explorer.explorerItems);
    const currentFolder = useAppSelector((state) => state.explorer.explorerItems[state.explorer.currentFolder]) as FolderT;
    const clipboardItems = useAppSelector((state) => state.explorer.clipboard);
    const isTrashTab = useAppSelector((state) => state.explorer.activeTab === 'trash');
    const [updateItem] = useUpdateItemMutation();
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState('');


    // If targetId exists, we're right-clicking on an item
    const targetItem = targetId ? explorerItems[targetId] : null;

    const { handleAddFolder, handleOpen, handleDelete, handleDownload, handleCut, handlePaste } = useContextMenu(targetItem);

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

    const handleCopy = () => {
        if (!targetItem) return;
        dispatch(copyToClipboard([targetItem.id]));
        dispatch(closeContextMenu());
    };

    // const handlePaste = () => {
    //     if (clipboardItems.operation === 'cut') {
    //         clipboardItems.items.forEach((itemId) => {
    //             if (!(currentFolder.children.includes(itemId))) {
    //                 dispatch(moveFileIntoFolder({ fileId: itemId, folderId: currentFolder.id }))
    //             }
    //         })
    //     }

    //     dispatch(clearClipboard())
    //     dispatch(closeContextMenu());
    // };

    if (isTrashTab) {

        return (
            <>
                <Button size={'menu'} disabled={!targetItem} className="hover:bg-red-600" onClick={handleDelete}>
                    <div>Delete</div>
                    <Icons.Trash3 className="h-4" />
                </Button>
            </>
        )
    }

    // If we're right-clicking on an empty area (no targetId)
    if (!targetItem) {

        const hasClipboardItems = clipboardItems.items.length > 0 && clipboardItems.operation !== null;


        return (
            <>
                <Button size={'menu'} onClick={() => handleAddFolder(currentFolder)}>
                    <div>New Folder</div>
                    <Icons.Folder_Add className="h-4" />
                </Button>
                <Button
                    size={'menu'}
                    onClick={() => handlePaste(currentFolder)}
                    disabled={!hasClipboardItems}
                    className={!hasClipboardItems ? "opacity-50 cursor-not-allowed" : ""}
                >
                    <div>Paste</div>
                    <Icons.Paste className="h-4" />
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
                <Button size={'menu'} onClick={() => handleOpen(targetItem, 'explorer')}>
                    <div>Open</div>
                </Button>
            )}
            {!targetItem.isFolder && (
                <>
                    {SupportedMimeTypeCheck(targetItem.details.type) && (<Button size={'menu'} onClick={() => handleOpen(targetItem)}>
                        <div>Open</div>
                    </Button>)}
                    <Button size={'menu'} onClick={handleDownload}>
                        <div>Download</div>
                        <Icons.Download className="h-4" />
                    </Button>
                </>
            )}
            <Button size={'menu'} onClick={handleRename}>
                <div>Rename</div>
                <Icons.Rename className="h-4" />
            </Button>
            <Button size={'menu'} onClick={handleCopy}>
                <div>Copy</div>
                <Icons.Copy className="h-4" />
            </Button>
            <Button size={'menu'} onClick={handleCut}>
                <div>Cut</div>
                {/* <Icons.Cut className="h-4" /> */}
            </Button>
            <ContextMenuSeparator />
            <Button size={'menu'} className="hover:bg-red-600" onClick={handleDelete}>
                <div>Move to trash</div>
                <Icons.Trash3 className="h-4" />
            </Button>
        </>
    );
};

export default ExplorerContextMenu; 