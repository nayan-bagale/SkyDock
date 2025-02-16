import cn from "@/utils";
import { FC, ReactNode } from "react";

interface FormProps {
    onSubmit: (e: any) => void;
    children: ReactNode;
    className?: string;
}

export const Form: FC<FormProps> = ({ onSubmit, children, className }) => {
    return (
        <form className={cn(" flex flex-col px-2 items-center w-[20rem] gap-2", className)} onSubmit={onSubmit}>
            {children}
        </form>
    )
}
