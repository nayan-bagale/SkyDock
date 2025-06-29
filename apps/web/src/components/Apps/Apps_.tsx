import { AnimatePresence } from "framer-motion";
import { Suspense } from "react";
import useAppProcess from "../hooks/useAppProcess";
import MountUnmountCallback from "../MountUnmountCallback";
import {
    AppsMenu,
    Explorer,
    ImageViewer,
    MusicPlayer,
    NotePad,
    PdfReader,
    Settings,
    Terminal,
    VideoPlayer,
} from "./Apps.Lazy";
import AppsErrorBoundary from "./AppsErrorBoundary";

const Apps_ = () => {
    const {
        terminalApp,
        explorerApp,
        settingsApp,
        imageViewerApp,
        musicPlayerApp,
        videoPlayerApp,
        appsMenuSystem,
        pdfReaderApp,
        notePadApp,
    } = useAppProcess();

    return (
        <>
            <AnimatePresence>
                {terminalApp.isProcessOn && (
                    <Suspense
                        fallback={
                            <MountUnmountCallback
                                onMount={terminalApp.setLoadingTrue}
                                onUnmount={terminalApp.setLoadingFalse}
                            />
                        }
                    >
                        <AppsErrorBoundary app={terminalApp}>
                            <Terminal />
                        </AppsErrorBoundary>
                    </Suspense>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {explorerApp.isProcessOn && (
                    <Suspense
                        fallback={
                            <MountUnmountCallback
                                onMount={explorerApp.setLoadingTrue}
                                onUnmount={explorerApp.setLoadingFalse}
                            />
                        }
                    >
                        <AppsErrorBoundary app={explorerApp}>

                            <Explorer />
                        </AppsErrorBoundary>

                    </Suspense>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {settingsApp.isProcessOn && (
                    <Suspense
                        fallback={
                            <MountUnmountCallback
                                onMount={settingsApp.setLoadingTrue}
                                onUnmount={settingsApp.setLoadingFalse}
                            />
                        }
                    >
                        <AppsErrorBoundary app={settingsApp}>
                            <Settings />
                        </AppsErrorBoundary>
                    </Suspense>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {imageViewerApp.isProcessOn && (
                    <Suspense
                        fallback={
                            <MountUnmountCallback
                                onMount={imageViewerApp.setLoadingTrue}
                                onUnmount={imageViewerApp.setLoadingFalse}
                            />
                        }
                    >
                        <AppsErrorBoundary app={imageViewerApp}>
                            <ImageViewer />
                        </AppsErrorBoundary>
                    </Suspense>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {musicPlayerApp.isProcessOn && (
                    <Suspense
                        fallback={
                            <MountUnmountCallback
                                onMount={musicPlayerApp.setLoadingTrue}
                                onUnmount={musicPlayerApp.setLoadingFalse}
                            />
                        }
                    >
                        <AppsErrorBoundary app={musicPlayerApp}>
                            <MusicPlayer />
                        </AppsErrorBoundary>
                    </Suspense>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {videoPlayerApp.isProcessOn && (
                    <Suspense
                        fallback={
                            <MountUnmountCallback
                                onMount={videoPlayerApp.setLoadingTrue}
                                onUnmount={videoPlayerApp.setLoadingFalse}
                            />
                        }
                    >
                        <AppsErrorBoundary app={videoPlayerApp}>
                            <VideoPlayer />
                        </AppsErrorBoundary>
                    </Suspense>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {pdfReaderApp.isProcessOn && (<Suspense
                    fallback={
                        <MountUnmountCallback
                            onMount={pdfReaderApp.setLoadingTrue}
                            onUnmount={pdfReaderApp.setLoadingFalse}
                        />
                    }>
                    <AppsErrorBoundary app={pdfReaderApp}>
                        <PdfReader />
                    </AppsErrorBoundary>

                </Suspense>)}
            </AnimatePresence>

            <AnimatePresence>
                {notePadApp.isProcessOn && (<Suspense
                    fallback={
                        <MountUnmountCallback
                            onMount={notePadApp.setLoadingTrue}
                            onUnmount={notePadApp.setLoadingFalse}
                        />
                    }>
                    <AppsErrorBoundary app={notePadApp}>
                        <NotePad />
                    </AppsErrorBoundary>
                </Suspense>)}
            </AnimatePresence>

            <AnimatePresence>
                {appsMenuSystem.isOpen && (<Suspense
                    fallback={
                        <MountUnmountCallback
                            onMount={appsMenuSystem.setLoadingTrue}
                            onUnmount={appsMenuSystem.setLoadingFalse}
                        />
                    }
                >
                    <AppsErrorBoundary app={appsMenuSystem}>
                        <AppsMenu />
                    </AppsErrorBoundary>

                </Suspense>)}
            </AnimatePresence>
        </>
    );
};

export default Apps_;
