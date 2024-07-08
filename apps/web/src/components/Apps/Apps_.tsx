import { useAppSelector } from "@/redux/hooks";
import { lazy, Suspense } from "react";
const Terminal = lazy(() => import('@/components/Apps/terminal/Terminal'))

const Apps_ = () => {
    const terminal = useAppSelector((state: any) => state.terminal.process);

    return (<>
        {terminal === 'on' && (
            <Suspense fallback={<div>Loding.....</div>}>
                <Terminal />
            </Suspense>
        )}
    </>
    )
}

export default Apps_