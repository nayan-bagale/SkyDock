import { useDrag } from '@/components/hooks/useDrag';
import { process } from '@/redux/features/apps/app/terminalSlice';
import { useAppDispatch } from '@/redux/hooks';
import { TerminalCard } from '@repo/ui';
import { useRef } from 'react';

const Terminal = () => {

    const dispatch = useAppDispatch()

    const draggableRef = useRef<any>(null);

    const { position, handleMouseDown } = useDrag({
        ref: draggableRef
    });

    const Action = {
        process: () => {
            dispatch(process('off'))
        },
    }

    return (
        <TerminalCard
            ref={draggableRef}
            style={{ x: position.x, y: position.y }}
            onMouseDown={handleMouseDown}
            Action={Action}
        />

    )
}

export default Terminal