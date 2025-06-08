import { useDrag } from "@/components/hooks/useDrag";
import useGetFileURl from "@/components/hooks/useGetFileURl";
import useResizeObserver from "@/components/hooks/useResizeObserver";
import { closePdfReader } from "@/redux/features/pdf-reader/pdfReaderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import PdfReaderCard from "@/ui/Cards/PdfReader/PdfReaderCard";
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
        e.preventDefault();
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

    const [numPages, setNumPages] = useState<number>();

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }
    console.log(width)

    return (
        <>
            <PdfReaderCard
                style={{ x: position.x, y: position.y }}
                ref={draggableRef}
                onMouseDown={handleMouseDown}
                onMouseDownCard={() => { }}
                action={Action}
                theme={theme}
                className={focusedApp === 'MusicPlayer' ? 'z-20' : ''}
                onContextMenu={handleContextMenu}
                title="PDF Reader"
            >
                <div
                    className="w-full h-full flex-1 overflow-y-auto"
                    ref={localRef}
                >
                    <Document
                        file={pdfUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        className={'p-4'}
                        loading={
                            <div className="flex items-center justify-center h-96">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        }
                    >
                        {Array.from(
                            new Array(numPages),
                            (el, index) => (
                                <div className="m-2" key={index}>
                                    <Page
                                        pageNumber={index + 1}
                                        scale={1}
                                        renderAnnotationLayer={true}
                                        renderTextLayer={true}
                                        className={'border fill m-0'}
                                        width={width - 32} // Adjust width based on the container size
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