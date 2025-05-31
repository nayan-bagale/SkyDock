import { setTerminalLoading } from "@/redux/features/terminal/terminalSlice"
import { useAppDispatch } from "@/redux/hooks"
import Spinner from "@/ui/Spinner"
import { useEffect } from "react"

export const TerminalSkeleton = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(setTerminalLoading(true));
        return () => {
            dispatch(setTerminalLoading(false));
        }

    }, [])
    return (
        <div
            className="absolute min-w-[32rem] min-h-[18rem] grid place-items-center z-20 text-gray-200 bg-black/60 backdrop-blur rounded-xl overflow-hidden"
        >
            <Spinner />
        </div>
    )
}