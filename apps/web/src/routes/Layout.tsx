import GlobalContextMenu from "@/components/GlobalContextMenu/GlobalContextMenu";
import useSkydockInitialLoad from "@/components/hooks/useSkydockInitialLoad";
import cn from "@/utils";
import LoadingScreen from "@skydock/ui/loading-screen";
import { Outlet } from "react-router";
import { Toaster } from "sonner";

const Layout = () => {
    // const token = useAppSelector((state) => state.auth.accessToken);
    const { isLoading } = useSkydockInitialLoad();

    const handleContext = (e: any) => {
        // e.preventDefault()
        // console.log(e.target)
    };


    return (
        <>
            <main className="pb-4 h-screen" onContextMenu={handleContext}>
                {isLoading ? <LoadingScreen /> : <>

                    <div
                        className={cn(
                            "flex flex-col items-center h-full",
                            // !token ? "justify-center" : "justify-between"
                        )}
                    >
                        {/* <AnimatePresence> */}
                        <Outlet />
                        {/* </AnimatePresence> */}
                    </div>
                    <GlobalContextMenu />
                </>}

            </main>
            <Toaster swipeDirections={['right', 'bottom']} />
        </>

    )
}

export default Layout