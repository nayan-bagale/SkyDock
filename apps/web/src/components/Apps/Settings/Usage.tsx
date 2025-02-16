import { motion } from "framer-motion";

const Usage = () => {
    return (
        <div className='flex flex-col gap-4'>
            <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
            >
                <h3 className="font-medium">Usage</h3>
                <div className="flex flex-wrap gap-3 shadow bg-white/60 backdrop-blur px-3 py-4 rounded-md">
                    <div className=" text-sm flex justify-between w-full">
                        <h4>Storage used</h4>
                        <div> 250mb of 1GB</div>
                    </div>
                    <div className=" relative w-full h-3 overflow-hidden rounded-full shadow-inner bg-gray-200">
                        <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: '25%' }}
                            transition={{ duration: 1 }}
                            className="absolute inset-0 h-3 trasition rounded-full bg-blue-500"
                        >

                        </motion.div>
                    </div>
                </div>
            </motion.div>
            <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.1 }}
            >
                <div className="flex flex-wrap gap-3 shadow bg-white/60 backdrop-blur px-3 py-4 rounded-md">
                    <div className=" text-sm flex justify-between w-full">
                        <h4>AI chat completions</h4>
                        <div> 2 used of 20</div>
                    </div>
                    <div className=" relative w-full h-3 overflow-hidden rounded-full shadow-inner bg-gray-200">
                        <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: '10%' }}
                            transition={{ duration: 1 }}
                            className="absolute inset-0 h-3 trasition rounded-full bg-blue-500"
                        >

                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default Usage