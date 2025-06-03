import { closeContextMenu } from '@/redux/features/contextMenu/contextMenuSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { ContextMenu } from '@/ui/ContextMenu';
import DesktopContextMenu from './DesktopContextMenu';
import DockContextMenu from './DockContextMenu';
import ExplorerContextMenu from './ExplorerContextMenu';
import ImageViewerContextMenu from './ImageViewerContextMenu';

const GlobalContextMenu = () => {
    const dispatch = useAppDispatch();
    const { isOpen, position, location, targetId, additionalData } = useAppSelector(
        (state) => state.contextMenu
    );

    const closeMenu = () => {
        dispatch(closeContextMenu());
    }

    // Close context menu when clicking outside

    if (!isOpen) return null;

    return (
        <ContextMenu
            close={closeMenu}
            className='fixed'
            position={{
                x: position.x,
                y: position.y
            }}
        >
            {location === 'Explorer' && (
                <ExplorerContextMenu targetId={targetId} additionalData={additionalData} />
            )}
            {location === 'Desktop' && (
                <DesktopContextMenu targetId={targetId} additionalData={additionalData} />
            )}
            {location === 'ImageViewer' && (
                <ImageViewerContextMenu additionalData={additionalData} />
            )}
            {
                location === 'Dock' && (
                    <DockContextMenu closeMenu={closeMenu} targetId={targetId} additionalData={additionalData} />
                )
            }
        </ContextMenu>
    );
};

export default GlobalContextMenu; 