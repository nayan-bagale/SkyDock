import { explorerProcess } from '@/redux/features/explorer/explorerSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Dock as DockPanel } from '@/ui/Dock/dock';
import { DockButton } from '@/ui/Dock/dock_button';
import { Icons } from '@repo/ui/icons';

const Dock = () => {
    const { Menu, React, Terminal, Folder, } = Icons;
    const dispatch = useAppDispatch();

    const apps = [
        {
            name: 'Menu',
            Icon: Menu,
            fun: () => { },
            active: false
        },
        {
            name: 'React',
            Icon: React,
            fun: () => { },
            active: false
        },
        // {
        //     name: 'Terminal',
        //     Icon: Terminal,
        //     fun: () => dispatch(terminal_process('on')),
        //     active: useAppSelector((state) => state.terminal.process) as string
        // },
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