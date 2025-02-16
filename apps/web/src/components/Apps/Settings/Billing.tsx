import { Button } from "@/ui/button";
import { motion } from "framer-motion";
const Billing = () => {
    return (
        <div className='flex flex-col gap-4'>
            <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
            >
                <h3 className="font-medium">Billing</h3>
                <div className="flex gap-3 shadow bg-white/60 backdrop-blur px-3 py-4 rounded-md">
                    <div className=" w-full text-sm flex flex-col">
                        <h4 className=" font-medium">Free</h4>
                        <div>You are currently on the free plan.</div>
                    </div>
                    <Button size='medium' intent={'cta'} className="bg-gradient-to-r from-lime-400 to-lime-500 text-white">Upgrade</Button>
                </div>
            </motion.div>
        </div>
    )
}

export default Billing