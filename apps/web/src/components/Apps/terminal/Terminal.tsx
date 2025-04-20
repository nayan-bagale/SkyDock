import { useDrag } from '@/components/hooks/useDrag';
import { setFocusedApp } from '@/redux/features/apps/appsSlice';
import { terminalProcess } from '@/redux/features/terminal/terminalSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { TerminalCard } from '@/ui/Cards/Terminal/TerminalCard';
import { useRef } from 'react';

const Terminal = () => {

    const dispatch = useAppDispatch()

    const draggableRef = useRef<HTMLDivElement>(null);
    const focusedApp = useAppSelector((state) => state.apps.focusedApp)

    const { position, handleMouseDown } = useDrag({
        ref: draggableRef
    });

    const handleZIndex = () => {
        focusedApp !== 'Terminal' && dispatch(setFocusedApp('Terminal'))
    }

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
            onMouseDownCard={handleZIndex}
            className={focusedApp === 'Terminal' ? 'z-30' : 'z-20'}
        />

    )
}

export default Terminal