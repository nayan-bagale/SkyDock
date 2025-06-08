import { useDrag } from "@/components/hooks/useDrag";
import useGetFileURl from "@/components/hooks/useGetFileURl";
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
    const focusedApp = useAppSelector((state) => state.apps.focusedApp);
    const theme = useAppSelector((state) => state.settings.apperance.theme);
    const pdfInfo = useAppSelector((state) => state.pdfReader.pdfInfo);
    const { getFileUrl } = useGetFileURl()
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

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
    const [pageNumber, setPageNumber] = useState<number>(1);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    return (
        <>
            <PdfReaderCard
                ref={draggableRef}
                style={{ x: position.x, y: position.y }}
                onMouseDown={handleMouseDown}
                onMouseDownCard={() => { }}
                action={Action}
                theme={theme}
                className={focusedApp === 'MusicPlayer' ? 'z-20' : ''}
                onContextMenu={handleContextMenu}
                title="PDF Reader"
            >

                <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    // onLoadError={onDocumentLoadError}
                    loading={
                        <div className="flex items-center justify-center h-96">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    }


                >
                    {Array.from(
                        new Array(numPages),
                        (el, index) => (
                            // <Page
                            //     // key={`page_${index + 1}`}
                            //     // pageNumber={index + 1}
                            //     // // width={window.innerWidth - 100}
                            //     // renderAnnotationLayer={false}
                            //     // // renderTextLayer={false}
                            //     // className="w-full h-auto"

                            // />
                            <div className="shadow-lg">
                                <Page
                                    pageNumber={pageNumber}
                                    scale={1}
                                    renderAnnotationLayer={true}
                                    renderTextLayer={true}
                                    className={'shadow border w-fit border-gray-200 rounded-lg my-2'}
                                />
                            </div>
                        ),
                    )}
                </Document>


            </PdfReaderCard>
        </>
    )
}

export default PdfReader