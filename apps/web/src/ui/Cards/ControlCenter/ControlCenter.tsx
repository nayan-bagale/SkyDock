import useOutsideAlerter from "@/components/hooks/useOnclickOutside";
import { Button } from "@/ui/button";
import { Icons } from "@skydock/ui/icons";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";

const ControlCenter = () => {
    const [show, setShow] = useState(false);
    const ref = useRef<HTMLDivElement>(null)

    useOutsideAlerter(ref, () => setShow(false));

    return (
        <div className=" relative">
            <Button onClick={() => setShow(true)}>
                <Icons.Control_Center className="h-4" />
            </Button>
            <AnimatePresence>
                {show && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        ref={ref}
                        className=" absolute z-10 top-7 h-40 w-28 bg-white/40 backdrop-blur py-1 px-2 text-xs min-w-[18rem] gap-1 shadow-md flex flex-col rounded-xl right-0 "
                    >
                        <div className=" shadow-inner relative bg-white/40 w-full h-8 overflow-hidden rounded-xl flex items-center">

                            <motion.div
                                className=" absolute bg-white transition h-full inset-0 rounded-xl"
                                style={{ width: '100px' }}
                            >
                            </motion.div>
                            <div className=" z-10 flex items-center gap-1 px-1.5 justify-between w-full">
                                {/* <Icons.Control_Center className="h-4" /> */}
                                <div className=" text-xs font-medium cursor-default ">
                                    File name
                                </div>
                                <div>
                                    100%
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    )
}

export default ControlCenter