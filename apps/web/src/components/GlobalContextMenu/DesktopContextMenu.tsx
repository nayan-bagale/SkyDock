import { useUpdateItemMutation } from '@/redux/apis/filesAndFolderApi';
import { closeContextMenu } from '@/redux/features/contextMenu/contextMenuSlice';
import { renameItem } from '@/redux/features/explorer/explorerSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Button } from '@/ui/button';
import { ContextMenuSeparator } from '@/ui/ContextMenu';
import SupportedMimeTypeCheck from '@/utils/supportedMimeTypeCheck';
import { FolderT } from '@skydock/types';
import { Icons } from '@skydock/ui/icons';
import { showToast } from '@skydock/ui/toast';
import { FileText, X } from 'lucide-react';
import { useState } from 'react';
import useAppProcess from '../hooks/useAppProcess';
import useContextMenu from '../hooks/useContextMenu';
import RenameInputBox from '../RenameInputBox';
import FileUploadButton from './UploadButton';

interface DesktopContextMenuProps {
    targetId: string | null;
    additionalData?: any;
}

const DesktopContextMenu = ({ targetId, additionalData }: DesktopContextMenuProps) => {
    const dispatch = useAppDispatch();
    const explorerItems = useAppSelector((state) => state.explorer.explorerItems);
    const currentFolder = explorerItems["desktop"] as FolderT;
    const [updateItem] = useUpdateItemMutation();
    const clipboardItems = useAppSelector((state) => state.explorer.clipboard);

    const { settingsApp } = useAppProcess();


    const [isRenaming, setIsRenaming] = useState(false);
    // const [newName, setNewName] = useState('');

    // If targetId exists, we're right-clicking on an item
    const targetItem = targetId ? explorerItems[targetId] : null;

    const { handleAddFolder, handleOpen, handleDelete, handleDownload, handleCut, handlePaste, handleGenerateEmptyFile } = useContextMenu(targetItem);

    const handleRename = () => {
        if (!targetItem) return;
        // setNewName(targetItem.name);
        setIsRenaming(true);
    };

    const handleRenameSubmit = async (newName: string) => {
        // e.preventDefault();
        if (!targetItem || !newName.trim()) return;

        try {
            await updateItem({ id: targetItem.id, name: newName }).unwrap();
            dispatch(renameItem({ id: targetItem.id, name: newName }));
            // setIsRenaming(false);
            dispatch(closeContextMenu());
        } catch (error) {
            console.error('Error renaming item:', error);
            showToast('Error renaming item', 'error');
        }
    };

    const handleDisplaySettings = () => {
        // Implement display settings logic
        dispatch(closeContextMenu());
        settingsApp.open();
    };

    // If we're right-clicking on an empty area (no targetId)
    if (!targetItem) {
        const hasClipboardItems = clipboardItems.items.length > 0 && clipboardItems.operation !== null;
        return (
            <>
                <Button
                    size={'menu'}
                    onClick={() => handlePaste(currentFolder)}
                    disabled={!hasClipboardItems}
                    className={!hasClipboardItems ? "opacity-50 cursor-not-allowed" : ""}
                >
                    <div>Paste</div>
                    <Icons.Paste className="h-4" />
                </Button>
                <FileUploadButton parent='desktop' onClick={() => dispatch(closeContextMenu())} />
                <ContextMenuSeparator />
                <Button size={'menu'} onClick={() => handleAddFolder(currentFolder)}>
                    <div>New Folder</div>
                    <Icons.Folder_Add className="h-4" />
                </Button>
                <Button size={'menu'} onClick={() => handleGenerateEmptyFile(currentFolder, 'txt')}>
                    <div>New Text</div>
                    <FileText className="h-4 w-4" />
                </Button>
                <ContextMenuSeparator />

                <Button size={'menu'} onClick={handleDisplaySettings}>
                    <div>Display Settings</div>
                    <Icons.Settings className="h-4" />
                </Button>
            </>
        );
    }

    if (!targetItem.isFolder && targetItem.state?.currentState === 'uploding') {
        // TODO: Handle cancel upload
        return (
            <Button size={'menu'} className="hover:bg-red-600">
                <div>Cancel Uploading</div>
                <X className="h-4" />
            </Button>
        );
    }


    // If we're renaming
    if (isRenaming) {

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
                <div>Move to trash</div>
                <Icons.Trash3 className="h-4" />
            </Button>
        </>
    );
};

export default DesktopContextMenu; 