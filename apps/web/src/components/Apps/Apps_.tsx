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
                        <Terminal />
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
                        <Explorer />
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
                        <Settings />
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
                        <ImageViewer />
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
                        <MusicPlayer />
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
                        <VideoPlayer />
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
                    <PdfReader />
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
                    <NotePad />
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
                    <AppsMenu />
                </Suspense>)}
            </AnimatePresence>
        </>
    );
};

export default Apps_;
