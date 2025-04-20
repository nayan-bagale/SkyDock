import Spinner from "@/ui/Spinner"

export const TerminalSkeleton = () => {
    return (
        <div
            className="absolute min-w-[32rem] min-h-[18rem] grid place-items-center z-20 text-gray-200 bg-black/60 backdrop-blur rounded-xl overflow-hidden"
        >
            <Spinner />
        </div>
    )
}