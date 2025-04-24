import { useAppDispatch } from '@/redux/hooks';
import { Dock as DockPanel } from '@/ui/Dock/dock';
import { DockButton } from '@/ui/Dock/dock_button';
import { Icons } from '@skydock/ui/icons';
import useAppProcess from '../hooks/useAppProcess';

const Dock = () => {
    const { Menu, React, Terminal, Folder, Settings2 } = Icons;
    const dispatch = useAppDispatch();
    const { settingsApp, terminalApp, explorerApp } = useAppProcess();

    const apps = [
        {
            name: 'Settings',
            Icon: Settings2,
            fun: settingsApp.open,
            active: settingsApp.isProcessOn
        },
        {
            name: 'Terminal',
            Icon: Terminal,
            fun: terminalApp.open,
            active: terminalApp.isProcessOn
        },
        {
            name: 'Folder',
            Icon: Folder,
            fun: explorerApp.open,
            active: explorerApp.isProcessOn
        },
    ]

    return (
        <DockPanel className='' intent={'primary'} size={'medium'}>
            {apps.map(({ name, Icon, fun, active }, index) =>
            (
                <DockButton
                    key={index}
                    intent={'primary'}
                    title={name}
                    onClick={fun}
                    isActive={active}
                >
                    <Icon className="h-10" />
                </DockButton>
            )
            )}
        </DockPanel>
    )
}

export default Dock