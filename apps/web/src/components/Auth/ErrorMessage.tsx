import { FC, ReactNode } from "react"

const ErrorMessage: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <p className=" p-1 text-white text-sm border-red-500 bg-red-500 rounded w-full">
            {children}
        </p>

    )
}

export default ErrorMessage