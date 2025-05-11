import cn from "@/utils";
import { motion } from "framer-motion";
import { FC, ReactNode } from "react";

interface AuthCardProps {
    children: ReactNode;
    className?: string;
}


export const AuthCard: FC<AuthCardProps> = ({ children, className }) => {

    return (
        <motion.div className={cn(" shadow flex flex-col my-auto items-center gap-2 text-white p-4 rounded-xl backdrop-blur-xl bg-black/20 ", className)}
            initial={{ opacity: 0, scale: 0.5, }}
            animate={{ opacity: 1, scale: 1, }}
            exit={{ opacity: 0, scale: 0.5, }}
            transition={{ duration: 0.2 }}
        >
            {children}
        </motion.div >
    )
}