import { cn } from "@/utils/index";
import { cva, VariantProps } from "class-variance-authority";
import { HTMLMotionProps, motion } from "framer-motion";



const DockStyles = cva(["border", "rounded-3xl", "backdrop-blur-md", "shadow", "gap-3"], {
    variants: {
        intent: {
            primary: [
                "bg-white/40",
                "text-white",
                "border-transparent",
            ],
        },
        size: {
            medium: ["text-base", "py-2", "px-4"],
        },
        orientation: {
            vertical: "flex flex-row",
            horizontal: "flex flex-col"
        }
    },
    compoundVariants: [
        {
            intent: "primary",
            size: "medium",
            class: "uppercase",
            // **or** if you're a React.js user, `className` may feel more consistent:
            // className: "uppercase"
        },
    ],
    defaultVariants: {
        orientation: 'vertical',
        intent: "primary",
        size: "medium",
    },
});

type DockProps = HTMLMotionProps<"div"> & VariantProps<typeof DockStyles>

const container = {
    hidden: { opacity: 0, y: 100 },
    visible: {
        opacity: 1,
        y: 1,
        transition: {
            delayChildren: 0.3,
            staggerChildren: 0.2
        }
    }
}

export const Dock = ({
    onClick,
    children,
    intent,
    size,
    className,
    ...props
}: DockProps) => {
    return (
        <motion.div
            onClick={onClick}
            className={cn(DockStyles({ intent, size, className }))}
            variants={container}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            {...props}
        >
            {children}
        </motion.div>

    );
};
