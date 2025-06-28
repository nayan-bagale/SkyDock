import usePdfReader from "@/components/hooks/apps/usePdfReader";
import useChangeAppFocus from "@/components/hooks/useChangeAppFocus";
import { useDrag } from "@/components/hooks/useDrag";
import useResizeObserver from "@/components/hooks/useResizeObserver";
import { MAX_WIDTH_PDF } from "@/constants";
import { closePdfReader, setPdfReaderLastPosition } from "@/redux/features/pdf-reader/pdfReaderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "@/ui/button";
import PdfReaderCard from "@/ui/Cards/PdfReader/PdfReaderCard";
import Spinner from "@/ui/Spinner";
import cn from "@/utils";
import { AppsT } from "@skydock/types/enums";
import { Separator } from "@skydock/ui/components";
import { ChevronLeft, ChevronRight, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useMemo, useRef } from "react";
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
        ref: draggableRef,
        onChangePosition: (position) => dispatch(setPdfReaderLastPosition(position))

    });
    const localRef = useRef<HTMLDivElement>(null);
    const focusedApp = useAppSelector((state) => state.apps.focusedApp);
    const theme = useAppSelector((state) => state.settings.apperance.theme);
    const { width } = useResizeObserver(localRef);
    const { handleAppFocus } = useChangeAppFocus(AppsT.PdfReader);

    const { pdfUrl, numPages, onDocumentLoadSuccess, onDocumentLoadError, scale, handleResetZoom, handleZoomIn, handleZoomOut, goToPage, pageNumber,
    } = usePdfReader()

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


    const pdfWidth = useMemo(() => {
        if (!width) return 0;
        // Calculate the width based on the container size
        const maxPdfWidth = MAX_WIDTH_PDF; // Maximum width for the PDF
        if (width > maxPdfWidth) {
            return maxPdfWidth - 32; // Adjust for padding
        }
        return width - 32; // Adjust for padding
    }, [width])


    return (
        <>
            <PdfReaderCard
                style={{ x: position.x, y: position.y }}
                ref={draggableRef}
                onMouseDown={handleMouseDown}
                onMouseDownCard={handleAppFocus}
                action={Action}
                theme={theme}
                isFocused={focusedApp === AppsT.PdfReader}
                onContextMenu={handleContextMenu}
                title="PDF Reader"
            >
                <div className="flex fixed mb-1.5 bottom-0 z-20 gap-2 -translate-x-1/2 left-1/2 justify-center bg-white/60 items-center backdrop-blur shadow border px-2 py-1 rounded-xl">
                    <Button
                        size="icon"
                        onClick={() => goToPage(pageNumber - 1)}
                        disabled={!pdfUrl || pageNumber <= 1}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center gap-1 w-9">
                        <span className="text-sm text-muted-foreground">{pageNumber} / {numPages}</span>
                    </div>

                    <Button
                        size="icon"
                        onClick={() => goToPage(pageNumber + 1)}
                        disabled={!pdfUrl || pageNumber >= numPages}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>

                    <Separator orientation="vertical" className="h-6" />
                    <Button onClick={handleZoomIn} size='icon' className="p-1">
                        <ZoomIn className="h-5 w-5" />
                    </Button>
                    <span className="text-sm text-muted-foreground min-w-9 text-center">
                        {Math.round(scale * 100)}%
                    </span>
                    <Button onClick={handleZoomOut} size='icon' className="p-1">
                        <ZoomOut className="h-5 w-5" />
                    </Button>
                    <Button onClick={handleResetZoom} size='icon' className="p-1">
                        <RotateCcw className="h-5 w-5" />
                    </Button>
                </div>
                <div
                    className="w-full bg-slate-200 h-full overflow-auto select-text"
                    ref={localRef}
                >
                    <Document
                        file={pdfUrl ?? undefined}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        className={cn(' p-2 pb-16 bg-slate-200', !pdfUrl && 'h-full')}
                        loading={
                            <div className="flex items-center justify-center h-96">
                                <Spinner />
                            </div>
                        }

                        noData={
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-500">No PDF file loaded</p>
                            </div>
                        }
                        error={
                            <div className="flex items-center justify-center h-full">
                                <p className="text-red-500">Error loading PDF file</p>
                            </div>
                        }
                    >
                        {Array.from(
                            new Array(numPages),
                            (el, index) => (
                                <div id={`page-${index + 1}`} className="my-2 flex flex-col items-center" key={index}>
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
                                        className={'border '}
                                        width={pdfWidth} // Adjust width based on the container 
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