import useChangeAppFocus from "@/components/hooks/useChangeAppFocus";
import { useDrag } from "@/components/hooks/useDrag";
import { settingsProcess } from "@/redux/features/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { SettingsCard } from "@/ui/Cards/Settings/Settings";
import { Icons } from "@skydock/ui/icons";
import { AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import AboutUs from "./AboutUs";
import Account from "./Account";
import Apperance from "./Apperance";
import Billing from "./Billing";
import Usage from "./Usage";

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
            Component: <Usage />
        },
        {
            name: 'Account',
            Icon: <Icons.Account className="w-5 h-5" />,
            id: '3',
            Component: <Account />
        },
        {
            name: 'Billing',
            Icon: <Icons.Dollar className="w-5 h-5" />,
            id: '4',
            Component: <Billing />
        },
        {
            name: 'About',
            Icon: <Icons.Logo className="w-5 h-5" />,
            id: '5',
            Component: <AboutUs />
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
            <AnimatePresence>
                {options.find(option => option.id === activeTab)?.Component}
            </AnimatePresence>
        </SettingsCard>
    )
}

export default Settings