import { process } from '@/redux/features/apps/app/terminalSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { DockButton, Dock as DockPanel } from '@repo/ui';
import { Icons } from '@repo/ui/icons';

const Dock = () => {
    const { Menu, React, Terminal, Folder, } = Icons;
    const dispatch = useAppDispatch();

    const apps = [
        {
            name: 'Menu',
            Icon: Menu,
            fun: () => { },
            active: 'off'
        },
        {
            name: 'React',
            Icon: React,
            fun: () => { },
            active: 'off'
        },
        {
            name: 'Terminal',
            Icon: Terminal,
            fun: () => dispatch(process('on')),
            active: useAppSelector((state: any) => state.terminal.process) as string
        },
        {
            name: 'Folder',
            Icon: Folder,
            fun: () => { },
            active: 'off'
        },
    ]

    return (
        <DockPanel className='' intent={'primary'} size={'medium'}>
            {apps.map(({ name, Icon, fun, active }, index) => (
                <DockButton
                    key={index}
                    intent={'primary'}
                    title={name}
                    onClick={fun}
                    isActive={active}
                >
                    <Icon className="h-10" />
                </DockButton>
            ))}
        </DockPanel>
    )
}

export default Dock