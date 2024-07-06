import React, { FC, useState } from 'react'
import { Icons } from '../icons'
import { AnimatePresence, motion } from 'framer-motion'

interface FileT {
    id: string;
    name: string;
    size: number;
    type: string;
    lastModifiedDate: string;
    File: File;
}

interface DisplayFilesIconsT {
    children?: React.ReactNode;
    className?: string;
    file: FileT;
    Icon: ({className}:{className:string}) => JSX.Element;
    onClick?: () => void;
}


export const DisplayFilesIcons:FC<DisplayFilesIconsT> = ({file, Icon}) => {

    const [tooltip, setTooltip] = useState(false)

    return (
        <motion.div className=' relative w-fit flex flex-col justify-center items-center p-0.5 rounded-md'
            whileHover={{
                backgroundColor: '#ffffff40',
            }}
            whileTap={{ scale: 0.9 }}
            onMouseEnter={() => setTooltip(true)}
            onMouseLeave={() => setTooltip(false)}

        >
            <Icon className=" w-12" />
            <p className='text-xs text-white cursor-default text-center text-wrap w-14'>{ file.name }</p>
            {tooltip && (
                <AnimatePresence>
                    <motion.div className=' text-xs absolute left-16 backdrop-blur bg-white/80 border rounded-lg px-1 py-0.5 '
                        initial={{ opacity: 0}}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className=' flex items-center gap-2 text-nowrap'>
                            <div>Type: </div>
                            <div>{file.type}</div>
                        </div>
                        <div className=' flex items-center gap-2 text-nowrap'>
                            <div>Size: </div>
                            <div>{file.size}</div>
                        </div>
                        <div className=' flex items-center gap-2 text-nowrap'>
                            <div>Last Modified: </div>
                            <div>{file.lastModifiedDate}</div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            )}
        </motion.div>
    )
}
