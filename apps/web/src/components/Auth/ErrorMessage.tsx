import { FC, ReactNode } from "react"

const ErrorMessage: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <p className=" p-1 text-red-500 text-sm border-red-500 border-2 rounded w-full">
            {children}
        </p>

    )
}

export default ErrorMessage