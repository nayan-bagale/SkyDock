import { onDropTweak } from '@/tweaks/ElementEvent';
import cn from '@/utils';
import { DragEventT, FileT, FolderT, MouseEventT } from '@skydock/types';
import { AnimatePresence, motion } from 'framer-motion';
import React, { FC, useRef, useState } from 'react';

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
    handleDragStart: MouseEventT;
    handleDrop: DragEventT;
}

export const DisplayItemsIcons: FC<DisplayItemsIconsT> =
    ({
        item,
        Icon,
        onContextMenu,
        view,
        onDoubleClick,
        onKeyDown,
        handleDragStart,
        handleDrop,
        className
    }) => {
        const [isOver, setIsOver] = useState(false);

        const iconRef = useRef<HTMLDivElement>(null);

        const enhancedOnKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
            onKeyDown(e);

        }

        const handleDragOverInner = (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            if (item.isFolder) {
                setIsOver(true); // Set highlight when a file is dragged over
            }
        };

        const handleDragLeaveInner = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsOver(false); // Remove highlight when the file leaves the folder

        };

        const handleDropInner = (event: React.DragEvent<HTMLDivElement>) => {
            setIsOver(false); // ✅ Ensure highlight is removed after dropping
            handleDrop(event)
        };

        return <>
            <AnimatePresence>
                {view === 'grid' &&
                    (<motion.div
                        ref={iconRef}
                        className={cn(
                            ' relative w-fit flex flex-col justify-center items-center p-1 rounded-md outline-gray-400/50 focus:bg-gray-400/40 hover:bg-gray-400/40',
                            isOver && 'bg-gray-400/10 border',
                            className
                            // !item.isFolder && item?.state?.currentState === 'downloading' && 'bg-blue-500',
                        )}
                        id={item.id}
                        whileTap={{ scale: 0.9 }}
                        onContextMenu={onContextMenu}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        title={item.name}
                        onDoubleClick={onDoubleClick}
                        onKeyDown={enhancedOnKeyDown}
                        draggable
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOverInner}
                        onDrop={(e) => onDropTweak(e, handleDropInner)}
                        onDragLeave={handleDragLeaveInner}
                    >
                        <Icon className="w-16" />
                        <p className={cn('text-[14px] relative cursor-default text-center select-none ', 'truncate h-7 w-[11ch] overflow-hidden')}>{item.name}</p>
                        {!item.isFolder && item?.state && item?.state?.currentState === 'uploding' && (
                            <>
                                <div className="bottom-0 right-0 overflow-hidden absolute bg-black/10 rounded-md w-full h-full">
                                    <motion.div className="bg-black/40" initial={{ height: '100%' }} animate={{ height: `${100 - item.state.progress}%` }} />
                                </div>
                                <div className='absolute flex justify-center items-center bg-black/50 shadow-sm backdrop-blur p-2 rounded-full font-bold text-white'>{item.state.progress}%</div>
                            </>
                        )}

                    </motion.div>)
                }
            </AnimatePresence>
            <AnimatePresence>
                {view === 'row' &&
                    (<motion.div className={cn('hover:bg-gray-400/40 text-xs relative w-full flex justify-start items-center p-1 gap-2 rounded-md', isOver && 'bg-gray-400/10 border', className)}
                        id={item.id}
                        whileTap={{ scale: 0.95 }}
                        onContextMenu={onContextMenu}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        title={item.name}
                        onDoubleClick={onDoubleClick}
                        onKeyDown={enhancedOnKeyDown}
                        draggable
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOverInner}
                        onDrop={handleDropInner}
                        onDragLeave={handleDragLeaveInner}
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
