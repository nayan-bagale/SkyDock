import GlobalContextMenu from "@/components/GlobalContextMenu/GlobalContextMenu";
import useSkydockInitialLoad from "@/components/hooks/useSkydockInitialLoad";
import { setSkydockLoading } from "@/redux/features/skydock/skydockSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import cn from "@/utils";
import LoadingScreen from "@skydock/ui/loading-screen";
import { AnimatePresence } from "framer-motion";
import { Outlet } from "react-router";
import { Toaster } from "sonner";

const Layout = () => {
    // const token = useAppSelector((state) => state.auth.accessToken);
    const { isLoading, isError } = useSkydockInitialLoad();
    const dispatch = useAppDispatch();
    const isSkydockLoading = useAppSelector((state) => state.skydock.isLoading);

    const handleContext = (e: any) => {
        // e.preventDefault()
        // console.log(e.target)
    };

    const onFinishLoading = () => {
        dispatch(setSkydockLoading(false));
    }


    return (
        <>
            <main className="pb-4 h-screen" onContextMenu={handleContext}>
                {isSkydockLoading && (
                    <AnimatePresence>
                        <LoadingScreen isResourcesLoaded={!isLoading} onFinishLoading={onFinishLoading} />
                    </AnimatePresence>
                )}{!isSkydockLoading && <>

                    <div
                        className={cn(
                            "flex flex-col items-center h-full",
                        )}
                    >
                        <Outlet />
                    </div>
                    <GlobalContextMenu />
                </>}

            </main>
            <Toaster swipeDirections={['right', 'bottom']} />
        </>

    )
}

export default Layout