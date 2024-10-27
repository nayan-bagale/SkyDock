import { FileT, FolderT } from '@/redux/features/explorer/explorerSlice';
import cn from '@/utils';
import { AnimatePresence, motion } from 'framer-motion';
import React, { FC } from 'react';


interface DisplayFilesIconsT {
    children?: React.ReactNode;
    className?: string;
    item: FileT | FolderT;
    Icon: ({ className }: { className: string }) => JSX.Element;
    onClick?: () => void;
    onContextMenu?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    view?: 'grid' | 'row'
}


export const DisplayItemsIcons: FC<DisplayFilesIconsT> = ({ item, Icon, onContextMenu, view = 'grid' }) => {
    const [clicked, setClicked] = React.useState(false)

    return <>
        <AnimatePresence>
            {view === 'grid' &&
                (<motion.div className={cn(' relative w-fit flex flex-col justify-center items-center p-1 rounded-md hover:bg-gray-400/40', clicked && 'bg-gray-400/10 border')}
                    id={item.id}
                    whileTap={{ scale: 0.9 }}
                    onContextMenu={onContextMenu}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    title={item.name}
                // onClick={() => setClicked(!clicked)}
                >
                    <Icon className=" w-12" />
                    <p className={cn('text-[10px] cursor-default text-center  select-none ', clicked ? 'w-14 h-full text-wrap ' : 'text-ellipsis h-7 w-[10ch] overflow-hidden')}>{item.name}</p>
                </motion.div>)
            }
        </AnimatePresence>
        <AnimatePresence>
            {view === 'row' &&
                (<motion.div className=' hover:bg-gray-400/40 text-xs relative w-full flex justify-start items-center p-1 gap-2 rounded-md'
                    id={item.id}
                    whileTap={{ scale: 0.95 }}
                    onContextMenu={onContextMenu}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <Icon className=" w-6" />
                    <p className='cursor-default select-none text-center'>{item.name}</p>
                    {/* <div>{file.fileDetails.type}</div>
                    <div>{file.fileDetails.lastModified.split(' ').slice(1, 4).join()}</div>
                    <div>{file.fileDetails.size}</div> */}
                </motion.div>)
            }
        </AnimatePresence>

    </>
}
