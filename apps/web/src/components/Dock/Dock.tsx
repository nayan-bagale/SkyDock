import { useAppDispatch } from '@/redux/hooks';
import { Dock as DockPanel } from '@/ui/Dock/dock';
import { DockButton } from '@/ui/Dock/dock_button';
import { Separator } from '@skydock/ui/components';
import { Icons } from '@skydock/ui/icons';
import { AnimatePresence } from 'framer-motion';
import useAppProcess from '../hooks/useAppProcess';

const Dock = () => {
    const { Menu, React, Terminal, Folder, Settings2, Image } = Icons;
    const dispatch = useAppDispatch();
    const { settingsApp, terminalApp, explorerApp, imageViewerApp, musicPlayerApp, videoPlayerApp } = useAppProcess();

    const apps = [
        {
            name: 'Settings',
            Icon: Settings2,
            fun: settingsApp.open,
            active: settingsApp.isProcessOn,
            isLoading: settingsApp.isLoading,
            pin: true
        },
        {
            name: 'Terminal',
            Icon: Terminal,
            fun: terminalApp.open,
            active: terminalApp.isProcessOn,
            isLoading: terminalApp.isLoading,
            pin: true
        },
        {
            name: 'Folder',
            Icon: Folder,
            fun: explorerApp.open,
            active: explorerApp.isProcessOn,
            isLoading: explorerApp.isLoading,
            pin: true
        },
        {
            name: 'Image Viewer',
            Icon: Image,
            fun: imageViewerApp.open,
            active: imageViewerApp.isProcessOn,
            isLoading: imageViewerApp.isLoading,
            pin: false
        },
        {
            name: 'Music Player',
            Icon: Icons.Music,
            fun: musicPlayerApp.open,
            active: musicPlayerApp.isProcessOn,
            isLoading: musicPlayerApp.isLoading,
            pin: false
        },
        {
            name: 'Video Player',
            Icon: Icons.Video,
            fun: videoPlayerApp.open,
            active: videoPlayerApp.isProcessOn,
            isLoading: videoPlayerApp.isLoading,
            pin: false
        },
        // {
        //     name: 'Menu',
        //     Icon: Menu,
        //     fun: () => dispatch({ type: 'TOGGLE_MENU' }),
        //     active: false,
        //     isLoading: false
        // }
    ]

    const notPinedApps = apps.filter(app => !app.pin && app.active);
    const pinedApps = apps.filter(app => app.pin);

    return (
        <DockPanel className='' intent={'primary'} size={'medium'}>
            {pinedApps.map(({ name, Icon, fun, active, isLoading }, index) =>
            (
                <AnimatePresence key={index}>
                    <DockButton
                        key={index}
                        intent={'primary'}
                        title={name}
                        onClick={fun}
                        isActive={active}
                        isLoading={isLoading}
                    >
                        <Icon className="h-10" />
                    </DockButton>
                </AnimatePresence>
            )
            )}
            {notPinedApps.length > 0 && <Separator className='h-10 my-auto rounded-full w-0.5' orientation='vertical' />}
            {notPinedApps.map(({ name, Icon, fun, active, isLoading }, index) =>
            (
                <AnimatePresence key={index}>

                    <DockButton
                        key={index}
                        intent={'primary'}
                        title={name}
                        onClick={fun}
                        isActive={active}
                        isLoading={isLoading}
                    >
                        <Icon className="h-10" />
                    </DockButton>
                </AnimatePresence>

            )
            )}
        </DockPanel>
    )
}

export default Dock