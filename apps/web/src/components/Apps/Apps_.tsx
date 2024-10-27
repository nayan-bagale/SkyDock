import { TerminalSkeleton } from "@/components/Apps/terminal/Terminal";
import { useAppSelector } from "@/redux/hooks";
import { lazy, Suspense } from "react";
const Terminal = lazy(() => import('@/components/Apps/terminal/Terminal'))
const Explorer = lazy(() => import('@/components/Apps/Explorer/Explorer'))



const Apps_ = () => {
    const terminal = useAppSelector((state) => state.terminal.process);
    const filesExplorer = useAppSelector((state) => state.filesexplorer.process)

    return (
        <>
            {terminal === 'on' && (
                <Suspense fallback={<TerminalSkeleton />}>
                    <Terminal />
                </Suspense>
            )}
            {filesExplorer === 'on' && (
                <Suspense fallback={<div>Loding.....</div>}>
                    <Explorer />
                </Suspense>
            )}
        </>
    )
}

export default Apps_