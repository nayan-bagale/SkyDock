import { useAppSelector } from "@/redux/hooks";
import { APPS_TEXT } from "@skydock/types/enums";
import { AnimatePresence, motion } from "framer-motion";

const AppOptions = () => {
    const focusedAppName = useAppSelector((state) => state.apps.focusedApp);

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
                {/* <Button size={'small'} className="drop-shadow"
                    initial={{ opacity: 0, }}
                    animate={{ opacity: 1, }}
                    exit={{ opacity: 0, }}
                >
                    File
                </Button> */}
            </>)}
        </AnimatePresence>
    )
}

export default AppOptions