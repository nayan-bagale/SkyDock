import cn from "@/utils";
import { Icons } from "@skydock/ui/icons";
import { FC, forwardRef, InputHTMLAttributes, useState } from "react";
import { Button } from "./button";

interface InputPasswordProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    placeholder?: string;
    id?: string;
}

export const InputPassword: FC<InputPasswordProps> = ({
    className,
    placeholder = "Password",
    id,
}) => {
    const [show, setShow] = useState(false);
    return (
        <div className="relative w-full">
            <input
                type={show ? "text" : "password"}
                placeholder={placeholder}
                id={id}
                className={cn(
                    "w-full rounded-lg bg-transparent border p-1 px-2 outline-sky-400 placeholder:text-white/80",
                    className
                )}
            />
            <Button
                onClick={() => setShow((p) => !p)}
                size={"icon"}
                intent={"primary"}
                className="top-1 right-1 absolute flex justify-center items-center rounded-full outline-sky-400 text-white"
            >
                {show ? (
                    <Icons.Eye className="w-5 h-5" />
                ) : (
                    <Icons.Closed_Eye className="pt-1 w-5 h-5" />
                )}
            </Button>
        </div>
    );
};

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    placeholder?: string;
    type?: "text" | "email" | "password" | "number";
    id?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, placeholder, type = "text", id, onChange, ...props }, ref) => {
        return (
            <input
                className={cn(
                    " w-full  rounded-lg bg-transparent border p-1 px-2 outline-sky-400 placeholder:text-white/80",
                    type === "number" &&
                    "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                    className
                )}
                placeholder={placeholder}
                ref={ref}
                type={type}
                id={id}
                onChange={onChange}
                {...props}
            />
        );
    }
);
