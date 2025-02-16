import useChangeAppFocus from "@/components/hooks/useChangeAppFocus";
import { useDrag } from "@/components/hooks/useDrag";
import { settingsProcess } from "@/redux/features/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { SettingsCard } from "@/ui/Cards/Settings/Settings";
import { Icons } from "@skydock/ui/icons";
import { useRef, useState } from "react";
import Apperance from "./Apperance";

const Settings = () => {
    const draggableRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();

    const focusedApp = useAppSelector((state) => state.apps.focusedApp);
    const [activeTab, setActiveTab] = useState('1')

    const { handleAppFocus } = useChangeAppFocus('Settings');


    const { position, handleMouseDown } = useDrag({
        ref: draggableRef
    });

    const theme = useAppSelector((state) => state.settings.apperance.theme);


    const Action = {
        close: () => { dispatch(settingsProcess(false)) }
    }

    const options = [
        {
            name: 'Apperance',
            Icon: <Icons.Paint className="w-5 h-5" />,
            id: '1',
            Component: <Apperance />
        },
        {
            name: 'Usage',
            Icon: <Icons.Pie className="w-5 h-5" />,
            id: '2',
        },
        {
            name: 'Account',
            Icon: <Icons.Account className="w-5 h-5" />,
            id: '3',
        },
        {
            name: 'Billing',
            Icon: <Icons.Dollar className="w-5 h-5" />,
            id: '4',
        },
        {
            name: 'About',
            Icon: <Icons.Logo className="w-5 h-5" />,
            id: '5',
        }
    ]

    return (
        <SettingsCard
            ref={draggableRef}
            action={Action}
            style={{ x: position.x, y: position.y }}
            onMouseDown={handleMouseDown}
            onMouseDownCard={handleAppFocus}
            className={focusedApp === 'Settings' ? 'z-20' : ''}
            theme={theme}
            options={options}
            activeTab={activeTab}
            setActiveTab={setActiveTab}

        >

            {options.find(option => option.id === activeTab)?.Component}

        </SettingsCard>
    )
}

export default Settings