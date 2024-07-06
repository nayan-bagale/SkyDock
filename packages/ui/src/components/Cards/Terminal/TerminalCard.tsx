import { motion } from "framer-motion"
import { forwardRef} from "react"
import CommandsInput from "./CommandsInput";

interface TerminalCardProps {
    style: { x: number, y: number };
    onMouseDown: any;

}

export const TerminalCard = forwardRef<HTMLDivElement, TerminalCardProps>(
    ({ style, onMouseDown }, ref) => {
        return (
            <div className=" resize absolute min-w-[32rem] max-w-[55rem] min-h-[18rem] max-h-[40rem] z-20 text-gray-200 bg-black/60 backdrop-blur rounded-xl overflow-hidden"
                ref={ref}
                style={{ left: style.x, top: style.y }}
            >
                <div className=" flex items-center justify-between px-2 py-1 text-sm w-full bg-black/80 rounded"
                    onMouseDown={onMouseDown}
                >
                    <div className=" flex gap-1 absolute">
                        <div className=" h-3 w-3 rounded-full bg-red-600"></div>
                        <div className=" h-3 w-3 rounded-full bg-yellow-600"></div>
                        <div className=" h-3 w-3 rounded-full bg-green-600"></div>
                    </div>
                    <div className="text-xs w-full flex items-center justify-center cursor-default">Terminal</div>
                </div>
                <CommandsInput />
            </div>
        )
    });
