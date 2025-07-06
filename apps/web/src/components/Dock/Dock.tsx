import { openContextMenu } from "@/redux/features/contextMenu/contextMenuSlice";
import { openTrash } from "@/redux/features/explorer/explorerSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Dock as DockPanel } from "@/ui/Dock/dock";
import { DockButton } from "@/ui/Dock/dock_button";
import { AppsT } from "@skydock/types/enums";
import { Separator } from "@skydock/ui/components";
import { Icons } from "@skydock/ui/icons";
import { AnimatePresence } from "framer-motion";
import useAppProcess from "../hooks/useAppProcess";

const Dock = () => {
    const { Menu, React, Terminal, Folder, Settings2, Image } = Icons;
    const dispatch = useAppDispatch();
    const {
        settingsApp,
        terminalApp,
        explorerApp,
        imageViewerApp,
        musicPlayerApp,
        videoPlayerApp,
        appsMenuSystem,
        pdfReaderApp,
        notePadApp,
        cameraApp
    } = useAppProcess();

    const systemApps = [
        {
            id: AppsT.AppsMenu,
            name: 'Menu',
            Icon: Menu,
            fun: appsMenuSystem.open,
            active: appsMenuSystem.isProcessOn,
            isLoading: appsMenuSystem.isLoading,
            pin: true,
        },
        {
            id: AppsT.Trash,
            name: 'Trash',
            Icon: Icons.Trash2,
            fun: () => { dispatch(openTrash()) },
            active: false,
            isLoading: false,
            pin: true,
        },

    ]

    const apps = [

        {
            id: AppsT.Settings,
            name: "Settings",
            Icon: Settings2,
            fun: settingsApp.open,
            active: settingsApp.isProcessOn,
            isLoading: settingsApp.isLoading,
            pin: true,
        },
        {
            id: AppsT.Terminal,
            name: "Terminal",
            Icon: Terminal,
            fun: terminalApp.open,
            active: terminalApp.isProcessOn,
            isLoading: terminalApp.isLoading,
            pin: true,
        },
        {
            id: AppsT.Explorer,
            name: "Folder",
            Icon: Folder,
            fun: explorerApp.open,
            active: explorerApp.isProcessOn,
            isLoading: explorerApp.isLoading,
            pin: true,
        },
        {
            id: AppsT.ImageViewer,
            name: "Image Viewer",
            Icon: Image,
            fun: imageViewerApp.open,
            active: imageViewerApp.isProcessOn,
            isLoading: imageViewerApp.isLoading,
            pin: false,
        },
        {
            id: AppsT.MusicPlayer,
            name: "Music Player",
            Icon: Icons.Music,
            fun: musicPlayerApp.open,
            active: musicPlayerApp.isProcessOn,
            isLoading: musicPlayerApp.isLoading,
            pin: false,
        },
        {
            id: AppsT.VideoPlayer,
            name: "Video Player",
            Icon: Icons.Video,
            fun: videoPlayerApp.open,
            active: videoPlayerApp.isProcessOn,
            isLoading: videoPlayerApp.isLoading,
            pin: false,
        },
        {
            id: AppsT.PdfReader,
            name: "PDF Reader",
            Icon: Icons.PDF,
            fun: pdfReaderApp.open,
            active: pdfReaderApp.isProcessOn,
            isLoading: pdfReaderApp.isLoading,
            pin: false,
        },
        {
            id: AppsT.NotePad,
            name: "Note Pad",
            Icon: Icons.Notepad,
            fun: notePadApp.open,
            active: notePadApp.isProcessOn,
            isLoading: notePadApp.isLoading,
            pin: false,
        },
        {
            id: AppsT.Camera,
            name: "Camera",
            Icon: Icons.Camera,
            fun: cameraApp.open,
            active: cameraApp.isProcessOn, // Camera is not a process, so we set it to false
            isLoading: cameraApp.isLoading, // Camera does not have a loading state
            pin: false,
        }

    ];

    const notPinedApps = apps.filter((app) => !app.pin && app.active);
    const pinedApps = apps.filter((app) => app.pin);

    const handleContextMenu = (
        e: React.MouseEvent,
        appName: keyof typeof AppsT
    ) => {
        e.preventDefault();
        dispatch(
            openContextMenu({
                position: { x: e.clientX, y: e.clientY },
                location: "Dock",
                targetId: appName,
                additionalData: {
                    appName,
                },
            })
        );
    };

    return (
        <>
            <DockPanel
                className=""
                intent={"primary"}
                size={"medium"}
                onContextMenu={(e) => e.preventDefault()}
            >
                <AnimatePresence>
                    {systemApps.map(({ name, Icon, fun, active, isLoading, id }, index) => (
                        <DockButton
                            key={id}
                            intent={"primary"}
                            title={name}
                            onClick={fun}
                            isActive={active}
                            isLoading={isLoading}
                            onContextMenu={(e) => handleContextMenu(e, id)}
                        >
                            <Icon className="h-10" />
                        </DockButton>
                    ))}
                </AnimatePresence>
                {systemApps.length > 0 && (
                    <Separator
                        className="h-10 my-auto rounded-full w-0.5"
                        orientation="vertical"
                    />
                )}

                <AnimatePresence >
                    {pinedApps.map(({ name, Icon, fun, active, isLoading, id }, index) => (
                        <DockButton
                            key={id}
                            intent={"primary"}
                            title={name}
                            onClick={fun}
                            isActive={active}
                            isLoading={isLoading}
                            onContextMenu={(e) => handleContextMenu(e, id)}
                        >
                            <Icon className="h-10" />
                        </DockButton>
                    ))}
                </AnimatePresence>
                {notPinedApps.length > 0 && (
                    <Separator
                        className="h-10 my-auto rounded-full w-0.5"
                        orientation="vertical"
                    />
                )}
                <AnimatePresence>
                    {notPinedApps.map(
                        ({ name, Icon, fun, active, isLoading, id }, index) => (
                            <DockButton
                                key={id}
                                intent={"primary"}
                                title={name}
                                onClick={fun}
                                isActive={active}
                                isLoading={isLoading}
                                onContextMenu={(e) => handleContextMenu(e, id)}
                            >
                                <Icon className="h-10" />
                            </DockButton>
                        )
                    )}
                </AnimatePresence>
            </DockPanel>
        </>
    );
};

export default Dock;
