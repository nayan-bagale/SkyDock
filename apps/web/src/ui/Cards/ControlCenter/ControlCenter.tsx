import useOutsideAlerter from "@/components/hooks/useOnclickOutside";
import { useAppSelector } from "@/redux/hooks";
import { Button } from "@/ui/button";
import cn from "@/utils";
import { Icons } from "@skydock/ui/icons";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";

const ControlCenter = () => {
    const [show, setShow] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const notification = useAppSelector((state) => state.controlCenter.notifications);

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
                        className={cn(" absolute z-10 top-7 h-40 w-28 bg-white/50 backdrop-blur p-2 text-xs min-w-[18rem] gap-1 shadow-md flex flex-col rounded-xl right-0 ")}
                    >
                        <AnimatePresence>
                            {notification.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    title={item.fileName}
                                    className=" relative bg-white w-full h-10 overflow-hidden px-1 rounded-lg flex items-center"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ delay: 0.1 * index }}
                                >

                                    <div className=" z-10 mb-1 flex items-center gap-1 px-1.5 justify-between w-full">
                                        {/* <Icons.Control_Center className="h-4" /> */}
                                        <div className=" text-xs font-medium cursor-default truncate w-2/3 ">
                                            {item.fileName}
                                        </div>
                                        {/* <div>
                                        {`${item.progress}%`}
                                    </div> */}
                                        <Button size={'icon'} onClick={() => item.cancelUpload && item.cancelUpload()}>
                                            <Icons.Cross className="h-4" />
                                        </Button>
                                    </div>
                                    <motion.div
                                        key={item.id}
                                        className=" absolute bg-sky-400 inset-8 transition h-2 w-0 left-0 rounded"
                                        animate={{ width: `${100}%` }}
                                    >
                                    </motion.div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    )
}

export default ControlCenter