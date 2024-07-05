import { useRef } from 'react';
import { useDrag } from '@/components/hooks/useDrag';
import { TerminalCard } from '@repo/ui'

const Terminal = () => {
    const draggableRef = useRef<any>(null);

    const { position, handleMouseDown } = useDrag({
        ref: draggableRef
    });
    return (
        <TerminalCard
            ref={draggableRef}
            style={{ x: position.x, y: position.y }}
            onMouseDown={handleMouseDown}
        />

    )
}

export default Terminal