import GlobalContextMenu from "@/components/GlobalContextMenu/GlobalContextMenu";
import useSkydockInitialLoad from "@/components/hooks/useSkydockInitialLoad";
import { useAppSelector } from "@/redux/hooks";
import cn from "@/utils";
import { Outlet } from "react-router";
import { Toaster } from "sonner";

const Layout = () => {
    const token = useAppSelector((state) => state.auth.accessToken);
    const { isLoading, data, isError } = useSkydockInitialLoad();

    const handleContext = (e: any) => {
        // e.preventDefault()
        // console.log(e.target)
    };


    return (
        <>
            <main className="pb-4 h-screen" onContextMenu={handleContext}>
                {isLoading ? <div>Loading...</div> : <>
                    <div
                        className={cn(
                            "flex flex-col items-center h-full",
                            !token ? "justify-center" : "justify-between"
                        )}
                    >
                        <Outlet />
                    </div>
                    <GlobalContextMenu />
                </>}

            </main>
            <Toaster position="top-center" />
        </>

    )
}

export default Layout