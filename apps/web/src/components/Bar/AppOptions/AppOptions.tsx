import { useAppSelector } from "@/redux/hooks";
import { APPS_TEXT, AppsT } from "@skydock/types/enums";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import ImageViewerOptions from "./Apps/ImageViewerOptions";
import NotePadOptions from "./Apps/NotePadOptions";

const AppOptions = () => {
    const focusedAppName = useAppSelector((state) => state.apps.focusedApp);

    const AppBasedOptions = useMemo(() => {
        switch (focusedAppName) {
            case AppsT.NotePad:
                return <NotePadOptions />;
            case AppsT.ImageViewer:
                return <ImageViewerOptions />;
            default:
                return null;
        }
    }, [focusedAppName])

    return (
        <AnimatePresence>
            {focusedAppName && (<>
                <motion.div
                    initial={{ opacity: 0, }}
                    animate={{ opacity: 1, }}
                    exit={{ opacity: 0, }}
                    className="font-semibold text-gray-800 text-xs cursor-default">
                    {APPS_TEXT[focusedAppName]}
                </motion.div>

                {AppBasedOptions}
            </>)}
        </AnimatePresence>
    )
}

export default AppOptions