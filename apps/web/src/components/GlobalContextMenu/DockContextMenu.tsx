import { useAppDispatch } from "@/redux/hooks";
import { Button } from "@/ui/button";
import { AppsT } from "@skydock/types/enums";
import { useMemo } from "react";
import useAppProcess from "../hooks/useAppProcess";

interface DockContextMenuProps {
    targetId: string | null;
    additionalData?: any;
    closeMenu?: () => void; // Optional function to close the menu
}
const DockContextMenu = ({
    targetId,
    additionalData,
    closeMenu,
}: DockContextMenuProps) => {
    const dispatch = useAppDispatch();

    const apps = useAppProcess();

    const app = useMemo(() => {
        const AppsObj = {
            [AppsT.Settings]: apps.settingsApp,
            [AppsT.Terminal]: apps.terminalApp,
            [AppsT.Explorer]: apps.explorerApp,
            [AppsT.ImageViewer]: apps.imageViewerApp,
            [AppsT.MusicPlayer]: apps.musicPlayerApp,
            [AppsT.VideoPlayer]: apps.videoPlayerApp,
            [AppsT.AppsMenu]: apps.appsMenuSystem,
        };
        if (!targetId) return null;
        if (!(targetId in AppsObj)) return null;
        return AppsObj[targetId as keyof typeof AppsObj];
    }, [
        apps.settingsApp,
        apps.terminalApp,
        apps.explorerApp,
        apps.imageViewerApp,
        apps.musicPlayerApp,
        apps.videoPlayerApp,
        apps.appsMenuSystem,
        targetId,
    ]);

    if (!app) return null;

    return (
        <>
            {!app.isProcessOn && (
                <Button
                    size={"menu"}
                    onClick={() => {
                        app.open();
                        closeMenu?.();
                    }}
                >
                    <div>Open</div>
                </Button>
            )}
            {app.isProcessOn && (
                <Button
                    size={"menu"}
                    onClick={() => {
                        app.close();
                        closeMenu?.();
                    }}
                >
                    <div>Close</div>
                </Button>
            )}
        </>
    );
};

export default DockContextMenu;
