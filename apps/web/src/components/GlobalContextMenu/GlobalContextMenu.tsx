import { closeContextMenu } from '@/redux/features/contextMenu/contextMenuSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { ContextMenu } from '@/ui/ContextMenu';
import { useRef } from 'react';
import useOnClickOutside from '../hooks/useOnclickOutside';
import DesktopContextMenu from './DesktopContextMenu';
import ExplorerContextMenu from './ExplorerContextMenu';
import ImageViewerContextMenu from './ImageViewerContextMenu';

const GlobalContextMenu = () => {
    const dispatch = useAppDispatch();
    const { isOpen, position, location, targetId, additionalData } = useAppSelector(
        (state) => state.contextMenu
    );
    const contextMenuRef = useRef<HTMLDivElement>(null);

    // Close context menu when clicking outside
    useOnClickOutside(contextMenuRef, () => {
        dispatch(closeContextMenu());
    });

    if (!isOpen) return null;

    return (
        <ContextMenu
            ref={contextMenuRef}
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
        </ContextMenu>
    );
};

export default GlobalContextMenu; 