import cn from "@/utils";
import { cva, VariantProps } from "class-variance-authority";
import { HTMLMotionProps, motion } from "framer-motion";
import { FC } from "react";

const ButtonStyles = cva([
    "flex",
    "items-center",
    "justify-center",
    "rounded-full",
    "transition-colors",
    "shadow-inner",
    "outline-sky-400",
    "cursor-default"
], {
    variants: {
        color: {
            lime: "bg-lime-400 hover:bg-lime-500",
            red: "bg-red-400 hover:bg-red-500",
            'dark-red': "bg-red-500 hover:bg-red-600",
        },
        size: {
            small: "w-3 h-3",
            medium: "w-3.5 h-3.5",
            large: "w-4 h-4",
        },
    }
})

type ButtonProps = HTMLMotionProps<"button"> & VariantProps<typeof ButtonStyles>

const ActionButton: FC<ButtonProps> = ({
    onClick, color, size, className, ...props
}) => {
    return (
        <motion.button type="button"
            className={cn(
                ButtonStyles({ color, size, className }),
                (props.disabled && "opacity-50 cursor-not-allowed ")
            )}
            {...props}
            onClick={onClick}
        ></motion.button>
    )
}

export default ActionButton