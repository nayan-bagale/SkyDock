import useChangeAppFocus from "@/components/hooks/useChangeAppFocus";
import { useDrag } from "@/components/hooks/useDrag";
import { settingsProcess } from "@/redux/features/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { SettingsCard } from "@/ui/Cards/Settings/Settings";
import { useRef } from "react";

const Settings = () => {
    const draggableRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();

    const focusedApp = useAppSelector((state) => state.apps.focusedApp)

    const { handleAppFocus } = useChangeAppFocus('Settings');


    const { position, handleMouseDown } = useDrag({
        ref: draggableRef
    });

    const Action = {
        close: () => { dispatch(settingsProcess(false)) }
    }

    return (
        <SettingsCard
            ref={draggableRef}
            action={Action}
            style={{ x: position.x, y: position.y }}
            onMouseDown={handleMouseDown}
            onMouseDownCard={handleAppFocus}
            className={focusedApp === 'Settings' ? 'z-20' : ''}

        >

        </SettingsCard>
    )
}

export default Settings