import cn from '@/utils'
import { motion } from 'framer-motion'
import { FC, ReactNode } from 'react'

export const Bar: FC<{ children?: ReactNode, className?: string }> = ({ children, className }) => {
  return (
    <motion.div className={cn(" w-full h-6 bg-white/60", className)}
      initial={{ y: -10 }}
      animate={{ y: 0 }}
      exit={{ y: -10 }}
    >
      {children}
    </motion.div>
  )
}
