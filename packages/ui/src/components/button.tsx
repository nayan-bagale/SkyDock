import { cva, VariantProps } from "class-variance-authority";
import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "../utils";


const ButtonStyles = cva(["font-semibold", "rounded-md", "w-fit"], {
    variants: {
        intent: {
            primary: [
                "bg-white/50",
                "text-white",
                "border-transparent",
                "hover:bg-white/80",
            ],
            // **or**
            // primary: "bg-blue-500 text-white border-transparent hover:bg-blue-600",
            secondary: [
                "bg-white",
                "text-gray-800",
                "border-gray-400",
                "hover:bg-gray-100",
            ],
            ghost: [
                "bg-transparent",
                "text-gray-900",
                "border-transparent",
                "hover:bg-white/80",
            ],
        },
        size: {
            small: ["text-xs", "py-0.5", "px-1"],
            medium: ["text-base", "py-2", "px-4"],
            icon: ["p-0.5"],
        },

    },
    // compoundVariants: [
    //     {
    //         intent: "ghost",
    //         class: "uppercase",
    //         size: "small",
    //         // **or** if you're a React.js user, `className` may feel more consistent:
    //         // className: "uppercase"
    //     },
    // ],
    defaultVariants: {
        intent: "ghost",
        size: "icon",
    },
});

type ButtonProps = HTMLMotionProps<"button"> & VariantProps<typeof ButtonStyles>


export const Button = ({
    onClick,
    children,
    intent,
    size,
    className,
    title,
    ...props
}: ButtonProps) => {

    console.log(props)

    return (
        <motion.button onClick={onClick}
            whileTap={{ scale: 0.95 }}
            type="button"
            className={cn(ButtonStyles({ intent, size, className }))}
            {...props}
        >
            {children}
        </motion.button>
    );
};
