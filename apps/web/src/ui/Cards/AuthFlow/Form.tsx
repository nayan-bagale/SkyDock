import { FC, ReactNode } from "react";

interface FormProps {
    onSubmit: (e: any) => void;
    children: ReactNode;
}

export const Form: FC<FormProps> = ({ onSubmit, children }) => {
    return (
        <form className=" flex flex-col px-2 items-center w-[20rem] gap-2" onSubmit={onSubmit}>
            {children}
        </form>
    )
}
