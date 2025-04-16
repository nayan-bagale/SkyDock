import { useAppSelector } from '@/redux/hooks'
import cn from '@/utils'
import { motion } from 'framer-motion'
import { FC, ReactNode } from 'react'

export const Bar: FC<{ children?: ReactNode, className?: string }> = ({ children, className }) => {
  const color = useAppSelector((state) => state.settings.apperance.theme?.color)
  return (
    <motion.div className={cn(" w-full h-6 bg-white/60", color, className)}
      initial={{ y: -22, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ delay: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
