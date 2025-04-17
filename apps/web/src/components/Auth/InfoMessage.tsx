import cn from "@/utils"
import { FC, ReactNode } from "react"


const InfoMessage: FC<{ children: ReactNode, className?: string }> = ({ children, className }) => {
    return (
        <p className={cn(" p-1 px-2 font-semibold text-white text-sm border-yellow-500 bg-yellow-500 rounded w-full", className)}>
            {children}
        </p>

    )
}

export default InfoMessage

