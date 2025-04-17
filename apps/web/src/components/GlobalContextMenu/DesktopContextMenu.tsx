import { useUpdateItemMutation } from '@/redux/apis/filesAndFolderApi';
import { closeContextMenu } from '@/redux/features/contextMenu/contextMenuSlice';
import { renameItem } from '@/redux/features/explorer/explorerSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Button } from '@/ui/button';
import { ContextMenuSeparator } from '@/ui/ContextMenu';
import { FolderT } from '@skydock/types';
import { Icons } from '@skydock/ui/icons';
import { useState } from 'react';
import useContextMenu from '../hooks/useContextMenu';
import RenameInputBox from '../RenameInputBox';

interface DesktopContextMenuProps {
    targetId: string | null;
    additionalData?: any;
}

const DesktopContextMenu = ({ targetId, additionalData }: DesktopContextMenuProps) => {
    const dispatch = useAppDispatch();
    const explorerItems = useAppSelector((state) => state.explorer.explorerItems);
    const currentFolder = explorerItems["desktop"] as FolderT;
    const [updateItem] = useUpdateItemMutation();

    const [isRenaming, setIsRenaming] = useState(false);
    // const [newName, setNewName] = useState('');

    // If targetId exists, we're right-clicking on an item
    const targetItem = targetId ? explorerItems[targetId] : null;

    const { handleAddFolder, handleOpen, handleDelete, handleDownload, handleCut, handlePaste } = useContextMenu(targetItem);

    const handleRename = () => {
        if (!targetItem) return;
        // setNewName(targetItem.name);
        setIsRenaming(true);
    };

    const handleRenameSubmit = async (newName: string) => {
        // e.preventDefault();
        if (!targetItem || !newName.trim()) return;

        try {
            await updateItem({ id: targetItem.id, name: newName });
            dispatch(renameItem({ id: targetItem.id, name: newName }));
            setIsRenaming(false);
            dispatch(closeContextMenu());
        } catch (error) {
            console.error('Error renaming item:', error);
        }
    };

    const handleDisplaySettings = () => {
        // Implement display settings logic
        dispatch(closeContextMenu());
    };

    // If we're right-clicking on an empty area (no targetId)
    if (!targetItem) {
        return (
            <>
                <Button size={'menu'} onClick={() => handleAddFolder(currentFolder)}>
                    <div>New Folder</div>
                    <Icons.Folder_Add className="h-4" />
                </Button>
                <Button size={'menu'} onClick={() => handlePaste(currentFolder)}>
                    <div>Paste</div>
                    <Icons.Copy className="h-4" />
                </Button>
                <ContextMenuSeparator />
                <Button size={'menu'} onClick={handleDisplaySettings}>
                    <div>Display Settings</div>
                    <Icons.Settings className="h-4" />
                </Button>
            </>
        );
    }

    // If we're renaming
    if (isRenaming) {
        // return (
        //     <form onSubmit={handleRenameSubmit} className="p-1">
        //         <input
        //             type="text"
        //             value={newName}
        //             onChange={(e) => setNewName(e.target.value)}
        //             autoFocus
        //             className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm"
        //             onBlur={() => setIsRenaming(false)}
        //         />
        //         <div className="flex justify-end mt-2">
        //             <Button
        //                 type="button"
        //                 onClick={() => setIsRenaming(false)}
        //                 className="mr-2"
        //             >
        //                 Cancel
        //             </Button>
        //             <Button type="submit">Rename</Button>
        //         </div>
        //     </form>
        // );

        return (
            <RenameInputBox
                setIsRenaming={setIsRenaming}
                handleRename={handleRenameSubmit}
                currentName={targetItem.name}
            />
        )
    }

    // If we're right-clicking on an item
    return (
        <>
            {targetItem.isFolder && (
                <Button size={'menu'} onClick={() => handleOpen(targetItem, 'desktop')}>
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
            <Button size={'menu'} onClick={handleCut}>
                <div>Cut</div>
                {/* <Icons.Cut className="h-4" /> */}
            </Button>
            <ContextMenuSeparator />
            <Button size={'menu'} className="hover:bg-red-600" onClick={handleDelete}>
                <div>Delete</div>
                <Icons.Trash3 className="h-4" />
            </Button>
        </>
    );
};

export default DesktopContextMenu; 