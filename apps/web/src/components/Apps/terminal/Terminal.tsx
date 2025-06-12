import useChangeAppFocus from '@/components/hooks/useChangeAppFocus';
import { useDrag } from '@/components/hooks/useDrag';
import { terminalProcess } from '@/redux/features/terminal/terminalSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { TerminalCard } from '@/ui/Cards/Terminal/TerminalCard';
import { AppsT } from '@skydock/types/enums';
import { useRef } from 'react';

const Terminal = () => {

    const dispatch = useAppDispatch()

    const draggableRef = useRef<HTMLDivElement>(null);
    const focusedApp = useAppSelector((state) => state.apps.focusedApp)
    const { handleAppFocus } = useChangeAppFocus(AppsT.Terminal);

    const { position, handleMouseDown } = useDrag({
        ref: draggableRef
    });

    const Action = {
        close: () => {
            dispatch(terminalProcess(false))
        },
    }

    return (
        <TerminalCard
            ref={draggableRef}
            style={{ x: position.x, y: position.y }}
            onMouseDown={handleMouseDown}
            Action={Action}
            onMouseDownCard={handleAppFocus}
            isFocused={focusedApp === AppsT.Terminal}
        />

    )
}

export default Terminal