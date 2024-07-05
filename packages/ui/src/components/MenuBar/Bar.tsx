import { motion } from 'framer-motion'

export const Bar = () => {
  return (
      <motion.div className=" w-full h-5 bg-white/60"
        initial={{ y: -10 }}
        animate={{ y: 0 }}
        exit={{ y: -10 }}
      >
          
      </motion.div>
  )
}
