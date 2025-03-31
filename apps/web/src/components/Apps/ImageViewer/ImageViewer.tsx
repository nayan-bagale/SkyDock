import useChangeAppFocus from '@/components/hooks/useChangeAppFocus';
import { useDrag } from '@/components/hooks/useDrag';
import useGetFileURl from '@/components/hooks/useGetFileURl';
import { openContextMenu } from '@/redux/features/contextMenu/contextMenuSlice';
import { closeImageViewer } from '@/redux/features/imageViewer/imageViewerSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { ImageViewerCard } from '@/ui/Cards/ImageViewer/ImageViewer';
import { FileT } from '@skydock/types';
import { useEffect, useRef, useState } from 'react';

const ImageViewer = () => {
    const dispatch = useAppDispatch();
    const { handleAppFocus } = useChangeAppFocus('ImageViewer');
    const draggableRef = useRef<HTMLDivElement>(null);
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [imageTitle, setImageTitle] = useState('Image Viewer');
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const { getImageUrl } = useGetFileURl()

    const focusedApp = useAppSelector((state) => state.apps.focusedApp);
    const imageViewerState = useAppSelector((state) => state.imageViewer.imageViewer);
    const explorerItems = useAppSelector((state) => state.explorer.explorerItems);

    const { position, handleMouseDown } = useDrag({
        ref: draggableRef
    });

    useEffect(() => {
        const setUrl = async () => {
            if (imageViewerState?.currentImageId) {
                const imageItem = explorerItems[imageViewerState.currentImageId] as FileT;
                if (imageItem && !imageItem.isFolder && imageItem.details.type.startsWith('image/')) {
                    setImageTitle(imageItem.name);
                    // In a real app, you would get the image URL from your backend
                    const { url } = await getImageUrl(`${imageItem.id}.${imageItem.name.split(".").pop()}`)
                    // console.log(url)
                    setCurrentImage(url);
                }
            }

        }
        setUrl()
    }, [imageViewerState, explorerItems]);

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.1, 3));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.1, 0.5));
    };

    const handleRotate = () => {
        setRotation(prev => (prev + 90) % 360);
    };

    const handleReset = () => {
        setZoom(1);
        setRotation(0);
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(openContextMenu({
            position: { x: e.clientX, y: e.clientY },
            location: 'imageViewer',
            additionalData: { currentImageId: imageViewerState?.currentImageId }
        }));
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
            className={focusedApp === 'ImageViewer' ? 'z-20' : ''}
            theme={theme}
            title={imageTitle}
            onContextMenu={handleContextMenu}
        >
            <div className="flex flex-col h-full">
                <div className="flex justify-center gap-2 p-2 border-b">
                    <button onClick={handleZoomIn} className="hover:bg-gray-200 p-1 rounded">
                        {/* <Icons.ZoomIn className="w-5 h-5" /> */}
                    </button>
                    <button onClick={handleZoomOut} className="hover:bg-gray-200 p-1 rounded">
                        {/* <Icons.ZoomOut className="w-5 h-5" /> */}
                    </button>
                    <button onClick={handleRotate} className="hover:bg-gray-200 p-1 rounded">
                        {/* <Icons.Rotate className="w-5 h-5" /> */}
                    </button>
                    <button onClick={handleReset} className="hover:bg-gray-200 p-1 rounded">
                        {/* <Icons.Reset className="w-5 h-5" /> */}
                    </button>
                </div>

                <div className="flex flex-1 justify-center items-center bg-gray-100 overflow-auto">
                    {currentImage ? (
                        <img
                            src={currentImage}
                            alt={imageTitle}
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
            </div>
        </ImageViewerCard>
    );
};

export default ImageViewer; 