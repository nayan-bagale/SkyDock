import GlobalContextMenu from "@/components/GlobalContextMenu/GlobalContextMenu";
import LockScreen from "@/components/LockScreen/LockScreen";
import useAutoLock from "@/components/hooks/useAutoLock";
import { AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import Apps_ from "./components/Apps/Apps_";
import Auth from "./components/Auth/Auth";
import MenuBar from "./components/Bar/MenuBar";
import Desktop from "./components/Desktop/Desktop";
import Dock from "./components/Dock/Dock";
import DraggingItem from "./components/DraggingItem";
import useIntializeFilesAndFolders from "./components/hooks/useIntializeFilesAndFolders";
import "./index.css";
import { useGetSessionQuery } from "./redux/APISlice";
import { useAppSelector } from "./redux/hooks";
import cn from "./utils";

function App() {
  const { data, error, isLoading } = useGetSessionQuery("");
  const { isLocked } = useAppSelector((state) => state.lockScreen);
  const handleContext = (e: any) => {
    // e.preventDefault()
    // console.log(e.target)
  };

  useIntializeFilesAndFolders({ skip: isLoading });

  // Use the auto-lock hook with a custom timeout (e.g., 10 minutes)
  useAutoLock(10 * 60 * 1000);

  const token = useAppSelector((state) => state.auth.accessToken);

  const MainScreen = useMemo(() => {
    return (
      <>
        <div className="w-full">
          <MenuBar />
        </div>
        <Desktop>
          {/* <Folders /> */}
          <Apps_ />
        </Desktop>
        <div className="justify-self-end">
          <Dock />
        </div>
        {<DraggingItem />}
      </>
    );
  }, []);

  if (isLoading) return <div>Loading...</div>;


  return (
    <main className="pb-4 h-screen" onContextMenu={handleContext}>
      <div
        className={cn(
          "flex flex-col items-center h-full",
          !token ? "justify-center" : "justify-between"
        )}
      >
        {token ? (
          <>
            <AnimatePresence>
              {isLocked && (
                <LockScreen />
              )}
            </AnimatePresence>
            {MainScreen}
          </>
        ) : (
          <AnimatePresence>
            <Auth />
          </AnimatePresence>
        )}
      </div>
      <GlobalContextMenu />
    </main>
  );
}

export default App;
