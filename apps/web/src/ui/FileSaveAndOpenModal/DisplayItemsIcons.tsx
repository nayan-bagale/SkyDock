import cn from '@/utils';
import { FileT, FolderT } from '@skydock/types';
import { AnimatePresence, motion } from 'framer-motion';
import React, { FC } from 'react';

interface DisplayItemsIconsT {
    children?: React.ReactNode;
    className?: string;
    item: FileT | FolderT;
    Icon: ({ className }: { className: string }) => JSX.Element;
    onClick?: () => void;
    onContextMenu?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    view: 'grid' | 'row';
    onDoubleClick?: () => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

export const DisplayItemsIcons: FC<DisplayItemsIconsT> =
    ({
        item,
        Icon,
        onContextMenu,
        view,
        onDoubleClick,
        onKeyDown,
        className,
        onClick
    }) => {

        const enhancedOnKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
            onKeyDown(e);
        }

        return <>
            <AnimatePresence>
                {view === 'row' &&
                    (<motion.div className={cn('hover:bg-gray-400/40 text-xs relative w-full flex justify-start items-center p-1 gap-2 focus:bg-gray-400/40 rounded-md', className)}
                        id={item.id}
                        whileTap={{ scale: 0.95 }}
                        onContextMenu={onContextMenu}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        title={item.name}
                        onDoubleClick={onDoubleClick}
                        onKeyDown={enhancedOnKeyDown}
                        onClick={onClick}
                    >
                        <Icon className="w-6" />
                        <p className='text-center cursor-default select-none'>{item.name}</p>
                        {/* <div>{item.fileDetails.type}</div> */}
                        {/* <div>{item.details.lastModified.split(' ').slice(1, 4).join()}</div>
                        <div>{item.details.size}</div> */}
                    </motion.div>)
                }
            </AnimatePresence>

        </>
    }
