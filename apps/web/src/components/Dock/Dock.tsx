import { explorerProcess } from '@/redux/features/explorer/explorerSlice';
import { settingsProcess } from '@/redux/features/settings/settingsSlice';
import { terminalProcess } from '@/redux/features/terminal/terminalSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Dock as DockPanel } from '@/ui/Dock/dock';
import { DockButton } from '@/ui/Dock/dock_button';
import { Icons } from '@skydock/ui/icons';

const Dock = () => {
    const { Menu, React, Terminal, Folder, Settings2 } = Icons;
    const dispatch = useAppDispatch();

    const apps = [
        {
            name: 'Settings',
            Icon: Settings2,
            fun: () => dispatch(settingsProcess(true)),
            active: useAppSelector((state) => state.settings.actions.isProcessOn)
        },
        {
            name: 'Terminal',
            Icon: Terminal,
            fun: () => dispatch(terminalProcess(true)),
            active: useAppSelector((state) => state.terminal.actions.isProcessOn)
        },
        {
            name: 'Folder',
            Icon: Folder,
            fun: () => dispatch(explorerProcess(true)),
            active: useAppSelector((state) => state.explorer.actions.isProcessOn)
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