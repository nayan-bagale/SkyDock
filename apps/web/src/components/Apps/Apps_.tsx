import { TerminalSkeleton } from "@/components/Apps/terminal/Terminal";
import { useAppSelector } from "@/redux/hooks";
import { AnimatePresence } from "framer-motion";
import { Suspense } from "react";
import { Explorer, ImageViewer, Settings, Terminal } from "./Apps.Lazy";

const Apps_ = () => {
    const terminal = useAppSelector((state) => state.terminal.actions.isProcessOn);
    const isExplorerOn = useAppSelector((state) => state.explorer.actions.isProcessOn);
    const isSettingsOn = useAppSelector((state) => state.settings.actions.isProcessOn);
    const isImageViewerOpen = useAppSelector((state) => state.imageViewer.actions.isProcessOn);

    return (
        <>
            <AnimatePresence>
                {terminal && (
                    <Suspense fallback={<TerminalSkeleton />}>
                        <Terminal />
                    </Suspense>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {isExplorerOn && (
                    <Suspense fallback={<div>Loding.....</div>}>
                        <Explorer />
                    </Suspense>
                )}
            </AnimatePresence >
            <AnimatePresence>
                {isSettingsOn && (
                    <Suspense fallback={<div>Loding.....</div>}>
                        <Settings />
                    </Suspense>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {isImageViewerOpen &&
                    <Suspense fallback={<div>Loding.....</div>}>
                        <ImageViewer />
                    </Suspense>
                }
            </AnimatePresence>
        </>
    )
}

export default Apps_