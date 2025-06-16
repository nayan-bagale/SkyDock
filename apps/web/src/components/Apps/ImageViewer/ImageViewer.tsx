import useImageViewer from '@/components/hooks/apps/useImageViewer';
import useChangeAppFocus from '@/components/hooks/useChangeAppFocus';
import { useDrag } from '@/components/hooks/useDrag';
import { closeImageViewer, setImageViewerLastPosition } from '@/redux/features/imageViewer/imageViewerSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Button } from '@/ui/button';
import { ImageViewerCard } from '@/ui/Cards/ImageViewer/ImageViewer';
import cn from '@/utils';
import { APPS_TEXT } from '@skydock/types/enums';
import { Icons } from '@skydock/ui/icons';
import { useRef } from 'react';

const ImageViewer = () => {
    const { handleReset, handleRotate, handleZoomIn, handleZoomOut, imageUrl, rotation, zoom, imageFileInfo } = useImageViewer();

    const draggableRef = useRef<HTMLDivElement>(null);

    const dispatch = useAppDispatch();
    const { handleAppFocus } = useChangeAppFocus('ImageViewer');
    const focusedApp = useAppSelector((state) => state.apps.focusedApp);

    const { position, handleMouseDown } = useDrag({
        ref: draggableRef,
        onChangePosition: (position) => dispatch(setImageViewerLastPosition(position))
    });

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // dispatch(openContextMenu({
        //     position: { x: e.clientX, y: e.clientY },
        //     location: 'ImageViewer',
        //     additionalData: { currentImageId: imageViewerState?.currentImageId }
        // }));
    };

    const Action = {
        close: () => {
            // Close the image viewer
            // You'll need to add this action to your apps slice
            dispatch(closeImageViewer())
        },
        size: {
            isMaximized: false,
            lastSize: { width: 0, height: 0 },
            changeSize: () => {
                // Toggle maximize
            }
        },
        minimize: () => {
            // Minimize the image viewer
        }
    };

    const theme = useAppSelector((state) => state.settings.apperance.theme);

    return (
        <ImageViewerCard
            ref={draggableRef}
            style={{ x: position.x, y: position.y }}
            onMouseDown={handleMouseDown}
            action={Action}
            onMouseDownCard={handleAppFocus}
            isFocused={focusedApp === 'ImageViewer'}
            theme={theme}
            title={imageFileInfo?.name ?? APPS_TEXT.ImageViewer}
            onContextMenu={handleContextMenu}
        >
            <div className="flex flex-col bg-white pt-1 w-full h-full">
                <div className="flex flex-1 justify-center items-center overflow-auto">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={imageFileInfo?.name}
                            style={{
                                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                                transition: 'transform 0.2s ease-in-out'
                            }}
                            className="max-w-full max-h-full object-contain"
                        />
                    ) : (
                        <div className="text-gray-400">No image selected</div>
                    )}
                </div>
                <div className={cn("flex justify-center gap-2 bg-black/5 shadow backdrop-blur mx-auto my-1 p-1 border-b rounded-lg w-fit")}>
                    <Button onClick={handleZoomIn} className="hover:bg-gray-200 rounded">
                        <Icons.Zoom_In className="w-5 h-5" />
                    </Button>
                    <Button onClick={handleZoomOut} className="hover:bg-gray-200 rounded">
                        <Icons.Zoom_Out className="w-5 h-5" />
                    </Button>
                    <Button onClick={handleRotate} className="hover:bg-gray-200 rounded">
                        <Icons.Rotate className="w-5 h-5" />
                    </Button>
                    <Button onClick={handleReset} className="hover:bg-gray-200 rounded">
                        <Icons.Reset className="w-6 h-6" />
                    </Button>
                </div>
            </div>
        </ImageViewerCard>
    );
};

export default ImageViewer; 