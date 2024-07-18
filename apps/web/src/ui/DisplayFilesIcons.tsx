import { AnimatePresence, motion } from 'framer-motion';
import React, { FC } from 'react';

interface FileT {
    id: string;
    name: string;
    size: number;
    type: string;
    lastModifiedDate: string;
    File: File | null;
}

interface DisplayFilesIconsT {
    children?: React.ReactNode;
    className?: string;
    file: FileT;
    Icon: ({ className }: { className: string }) => JSX.Element;
    onClick?: () => void;
    onContextMenu?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    view?: 'grid' | 'row'
}


export const DisplayFilesIcons: FC<DisplayFilesIconsT> = ({ file, Icon, onContextMenu, view = 'grid' }) => {

    return <>
        <AnimatePresence>
            {view === 'grid' &&
                (<motion.div className=' relative w-fit flex flex-col justify-center items-center p-1 rounded-md hover:bg-blue-400'
                    id={file.id}
                    whileTap={{ scale: 0.9 }}
                    onContextMenu={onContextMenu}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <Icon className=" w-12" />
                    <p className='text-xs cursor-default text-center text-wrap w-14'>{file.name}</p>
                </motion.div>)
            }
        </AnimatePresence>
        <AnimatePresence>
            {view === 'row' &&
                (<motion.div className=' hover:bg-blue-400 text-xs relative w-full flex justify-start items-center p-1 gap-2 rounded-md'
                    id={file.id}
                    whileTap={{ scale: 0.9 }}
                    onContextMenu={onContextMenu}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <Icon className=" w-6" />
                    <p className='cursor-default text-center'>{file.name}</p>
                    <div>{file.type}</div>
                    <div>{file.lastModifiedDate.split(' ').slice(1, 4).join()}</div>
                    <div>{file.size}</div>
                </motion.div>)
            }
        </AnimatePresence>

    </>
}
