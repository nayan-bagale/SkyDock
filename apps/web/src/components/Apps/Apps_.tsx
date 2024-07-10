import { useAppSelector } from "@/redux/hooks";
import { lazy, Suspense } from "react";
const Terminal = lazy(() => import('@/components/Apps/terminal/Terminal'))
const FilesExplorer = lazy(() => import('@/components/Apps/FilesExplorer/FilesExplorer'))

const Apps_ = () => {
    const terminal = useAppSelector((state: any) => state.terminal.process);
    const filesExplorer = useAppSelector((state: any) => state.filesexplorer.process)

    return (<>
        {terminal === 'on' && (
            <Suspense fallback={<div>Loding.....</div>}>
                <Terminal />
            </Suspense>
        )}
        {filesExplorer === 'on' && (
            <Suspense fallback={<div>Loding.....</div>}>
                <FilesExplorer />
            </Suspense>
        )}
    </>
    )
}

export default Apps_