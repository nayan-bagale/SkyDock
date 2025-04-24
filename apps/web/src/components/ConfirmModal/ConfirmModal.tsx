import cn from "@/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";


const Card = ({ children, className }: { children: ReactNode, className: string }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
            className=" absolute flex bg-black/20 z-30 backdrop-blur-sm justify-center items-center inset-0"
        >
            <motion.div
                className={cn(
                    "text-black shadow absolute bg-stone-100 min-w-[30rem] max-w-[80rem] min-h-[10rem] max-h-[40rem] backdrop-blur rounded-xl overflow-hidden",
                    // theme?.color,
                    className
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
            >

                {children}
            </motion.div>
        </motion.div>
    )
}

export default Card