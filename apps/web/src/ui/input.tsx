import cn from "@/utils"
import { Icons } from "@skydock/ui/icons"
import { FC, useState } from "react"
import { Button } from "./button"

interface InputPasswordProps {
    className?: string
    placeholder?: string
    id?: string
}

export const InputPassword: FC<InputPasswordProps> = ({ className, placeholder = "Password", id }) => {
    const [show, setShow] = useState(false)
    return (
        <div className=" relative w-full ">
            <input
                type={show ? 'text' : 'password'}
                placeholder={placeholder}
                id={id}
                className={cn("w-full rounded-lg bg-transparent border p-1 px-2 outline-none placeholder:text-white/80", className)}
            />
            <Button
                onClick={() => setShow(p => !p)}
                size={'icon'}
                intent={'primary'}
                className=" text-white rounded-full flex items-center justify-center absolute top-1 right-1">
                {show ? <Icons.Eye className=" h-5  w-5 " /> : <Icons.Closed_Eye className=" h-5  w-5  pt-1" />}
            </Button>
        </div>
    )
}

interface InputProps {
    className?: string
    placeholder?: string
    type?: 'text' | 'email' | 'password'
    id?: string
}

export const Input: FC<InputProps> = ({ className, placeholder, type = "text", id }) => {
    return (
        <input className={cn(" w-full rounded-lg bg-transparent border p-1 px-2 outline-none placeholder:text-white/80", className)}
            placeholder={placeholder}
            type={type}
            id={id}
        />
    )
}
