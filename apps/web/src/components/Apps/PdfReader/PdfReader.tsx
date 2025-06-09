import usePdfReader from "@/components/hooks/apps/usePdfReader";
import useChangeAppFocus from "@/components/hooks/useChangeAppFocus";
import { useDrag } from "@/components/hooks/useDrag";
import useGetFileURl from "@/components/hooks/useGetFileURl";
import useResizeObserver from "@/components/hooks/useResizeObserver";
import { closePdfReader } from "@/redux/features/pdf-reader/pdfReaderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import PdfReaderCard from "@/ui/Cards/PdfReader/PdfReaderCard";
import Spinner from "@/ui/Spinner";
import cn from "@/utils";
import { SupportedMimeTypes } from "@skydock/types/enums";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const PdfReader = () => {
    const dispatch = useAppDispatch();
    const draggableRef = useRef<HTMLDivElement>(null);
    const { position, handleMouseDown } = useDrag({
        ref: draggableRef
    });
    const localRef = useRef<HTMLDivElement>(null);
    const focusedApp = useAppSelector((state) => state.apps.focusedApp);
    const theme = useAppSelector((state) => state.settings.apperance.theme);
    const pdfInfo = useAppSelector((state) => state.pdfReader.pdfInfo);
    const { getFileUrl } = useGetFileURl()
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const { width } = useResizeObserver(localRef);
    const { handleAppFocus } = useChangeAppFocus('PdfReader');

    const { numPages, onDocumentLoadSuccess, onDocumentLoadError, scale, handleResetZoom, handleZoomIn, handleZoomOut,
        isLoading
    } = usePdfReader()


    useEffect(() => {
        const setUrl = async () => {
            if (pdfInfo?.id) {
                if (pdfInfo && !pdfInfo.isFolder && pdfInfo.details.type.startsWith(SupportedMimeTypes.PDF)) {
                    // In a real app, you would get the image URL from your backend
                    const { url } = await getFileUrl(`${pdfInfo.id}.${pdfInfo.name.split(".").pop()}`)
                    setPdfUrl(url);
                }
            }

        }
        setUrl()
    }, [pdfInfo]);



    const handleContextMenu = (e: React.MouseEvent) => {
        // e.preventDefault();
        e.stopPropagation();
        // dispatch(openContextMenu({
        //     position: { x: e.clientX, y: e.clientY },
        //     location: 'imageViewer',
        //     additionalData: { currentImageId: imageViewerState?.currentImageId }
        // }));
    };

    const Action = {
        close: () => {
            // Close the image viewer
            // You'll need to add this action to your apps slice
            // dispatch(closeImageViewer())
            dispatch(closePdfReader());

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

    return (
        <>
            <PdfReaderCard
                style={{ x: position.x, y: position.y }}
                ref={draggableRef}
                onMouseDown={handleMouseDown}
                onMouseDownCard={handleAppFocus}
                action={Action}
                theme={theme}
                className={focusedApp === 'MusicPlayer' ? 'z-20' : ''}
                onContextMenu={handleContextMenu}
                title="PDF Reader"

            >
                {/* <div className="flex z-20 overflow-hidden gap-2 justify-center items-center bg-white/60 backdrop-blur shadow px-2 py-1 rounded w-full">
                    <Button onClick={handleZoomIn} size='icon' className="p-1">
                        <ZoomIn className="h-5 w-5" />
                    </Button>
                    <Button onClick={handleZoomOut} size='icon' className="p-1">
                        <ZoomOut className="h-5 w-5" />
                    </Button>
                    <Button onClick={handleResetZoom} size='icon' className="p-1">
                        <RotateCcw className="h-5 w-5" />
                    </Button>
                </div> */}
                <div
                    className="w-full h-full overflow-auto select-text"
                    ref={localRef}
                >
                    <Document
                        file={pdfUrl ?? undefined}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        className={cn(' p-2 bg-slate-200', !pdfUrl && 'h-full')}
                        loading={
                            <div className="flex items-center justify-center h-96">
                                {/* <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"> */}
                                <Spinner />
                                {/* </div> */}
                            </div>
                        }

                        noData={
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-500">No PDF file loaded</p>
                            </div>
                        }
                        error={
                            <div className="flex items-center justify-center h-96">
                                <p className="text-red-500">Error loading PDF file</p>
                            </div>
                        }
                    >
                        {Array.from(
                            new Array(numPages),
                            (el, index) => (
                                <div className="my-2 pb-4" key={index}>
                                    <Page
                                        loading={
                                            <div className="flex items-center justify-center h-96">
                                                <Spinner />
                                            </div>
                                        }
                                        pageNumber={index + 1}
                                        scale={scale}
                                        renderAnnotationLayer={true}
                                        renderTextLayer={true}
                                        className={'border m-0'}
                                        width={(width) - 32} // Adjust width based on the container size
                                    />
                                </div>
                            ),
                        )}
                    </Document>
                </div>
            </PdfReaderCard>
        </>
    )
}

export default PdfReader