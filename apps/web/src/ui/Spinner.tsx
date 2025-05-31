import cn from "@/utils"
import { Icons } from "@skydock/ui/icons"

const Spinner = ({ className }: { className?: string }) => {
    return (
        // <div className=" animate-spin">
        <Icons.Spinner className={cn(" animate-spin text-white h-10 w-10 bg-transparent ", className)} />
        // </div>
    )
}

export default Spinner