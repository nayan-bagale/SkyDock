import { onDropTweak } from '@/tweaks/ElementEvent';
import { Icons } from '@skydock/ui/icons';
import { motion } from 'framer-motion';
import React, { forwardRef, ReactNode, useCallback, useRef, useState } from 'react';
import cn from '../utils';

export type DraggedFilesT = Pick<React.DragEvent<HTMLDivElement>, 'dataTransfer'>['dataTransfer']['files']

interface DragDropWrapperProps {
    children?: ReactNode
    handleExternalfiles: (files: DraggedFilesT) => void
    handleInternalFiles: (e: React.DragEvent<HTMLDivElement>) => void
    disableDrag?: boolean
}

export const DragDropWrapper = forwardRef<HTMLDivElement, DragDropWrapperProps>(
    ({ children, handleExternalfiles, handleInternalFiles, disableDrag }, ref) => {
        const [dragging, setDragging] = useState(false);
        const dragCounter = useRef(0);

        const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            if (disableDrag) return;
            // Only set dragging true if the drag is from outside the browser
            if (e.dataTransfer.types.includes("Files") && (e.dataTransfer.types.length === 1)) {
                dragCounter.current += 1;  // Track nested drag enters
                setDragging(true);
            }
        }, [disableDrag])

        const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault()
            // Only set dragging true if the drag is from outside the browser
            // This is to prevent the drop zone from being highlighted when dragging files within the browser
            // This will trigger when the file is dragged over the Upload logo and Drag and drop text
            if (e.dataTransfer.types.includes("Files") && (e.dataTransfer.types.length === 1)) {
                e.stopPropagation() // Prevent the dragover event from bubbling up when file is dragged over the drop zone
                if (disableDrag) return;
                if (!dragging) setDragging(true)
            }
        }, [disableDrag, dragging])

        const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            // Only call handlefiles if the drag is from outside the browser
            if (e.dataTransfer.types.includes("Files") && (e.dataTransfer.types.length === 1)) {
                if (disableDrag) return;
                handleExternalfiles(e.dataTransfer.files);
                // console.log('Element is from the browser.');
            } else {
                handleInternalFiles(e)
            }
            dragCounter.current = 0; // Reset counter on drop

            setDragging(false)
        }, [disableDrag, handleExternalfiles, handleInternalFiles])

        const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
            const target = e.relatedTarget as HTMLElement | null;
            e.preventDefault();
            e.stopPropagation();
            if (disableDrag) return;
            // Only set dragging false if the drag leaves the drop zone

            if (!target || !target.closest('.drop-zone')) {
                // setDragging(false);
                dragCounter.current -= 1;
                if (dragCounter.current === 0) {
                    setDragging(false);
                }
            }
        }, [disableDrag]);

        return (
            <div className='p-1 w-full h-full' ref={ref}>
                <div className={cn('w-full h-full relative rounded-2xl p-0.5 transition-colors duration-300 ',
                    dragging && ' z-50 border-2 border-dashed backdrop-blur bg-white/20 border-gray-400',
                )}
                    onDragOver={handleDragOver}
                    onDrop={(e) => onDropTweak(e, handleDrop)}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                >
                    {!dragging && children}
                    {dragging && (
                        <div className='bottom-6 left-1/2 absolute flex flex-col items-center gap-2 w-fit text-xs -translate-x-1/2 transform'

                        >
                            <motion.div className='bg-white shadow p-1 rounded-full w-fit'
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                <Icons.Upload className='h-10' />
                            </motion.div>
                            <div className='bg-white shadow p-4 rounded-2xl w-fit text-center'>
                                <div>
                                    Drag and drop your files here
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    });
