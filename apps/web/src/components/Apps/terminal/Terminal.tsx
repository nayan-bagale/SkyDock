import { useDrag } from '@/components/hooks/useDrag';
import { process } from '@/redux/features/apps/app/terminalSlice';
import { useAppDispatch } from '@/redux/hooks';
import { TerminalCard } from '@/ui/Cards/Terminal/TerminalCard';
import Spinner from '@/ui/Spinner';
// import { TerminalCard } from '@repo/ui';
import { useRef } from 'react';

export const TerminalSkeleton = () => {
    return (
        <div
            className="absolute min-w-[32rem] min-h-[18rem] grid place-items-center z-20 text-gray-200 bg-black/60 backdrop-blur rounded-xl overflow-hidden"
        >
            <Spinner />
        </div>
    )
}

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