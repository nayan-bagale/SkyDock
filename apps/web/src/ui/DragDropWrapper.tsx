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
}

export const DragDropWrapper = forwardRef<HTMLDivElement, DragDropWrapperProps>(
    ({ children, handleExternalfiles, handleInternalFiles }, ref) => {
        const [dragging, setDragging] = useState(false);
        const dragCounter = useRef(0);

        const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            // Only set dragging true if the drag is from outside the browser
            if (e.dataTransfer.types.includes("Files") && (e.dataTransfer.types.length === 1)) {
                dragCounter.current += 1;  // Track nested drag enters
                setDragging(true);
            }
        }, [])

        const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault()

            // Only set dragging true if the drag is from outside the browser
            // This is to prevent the drop zone from being highlighted when dragging files within the browser
            // This will trigger when the file is dragged over the Upload logo and Drag and drop text
            if (e.dataTransfer.types.includes("Files") && (e.dataTransfer.types.length === 1)) {
                e.stopPropagation() // Prevent the dragover event from bubbling up when file is dragged over the drop zone
                if (!dragging) setDragging(true)
            }
        }, [dragging])

        const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();

            dragCounter.current = 0; // Reset counter on drop
            // Only call handlefiles if the drag is from outside the browser
            if (e.dataTransfer.types.includes("Files") && (e.dataTransfer.types.length === 1)) {
                handleExternalfiles(e.dataTransfer.files);
                // console.log('Element is from the browser.');
            } else {
                handleInternalFiles(e)
            }

            setDragging(false)
        }, [handleExternalfiles, handleInternalFiles])

        const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
            const target = e.relatedTarget as HTMLElement | null;
            e.preventDefault();
            e.stopPropagation();
            // Only set dragging false if the drag leaves the drop zone

            if (!target || !target.closest('.drop-zone')) {
                // setDragging(false);
                dragCounter.current -= 1;
                if (dragCounter.current === 0) {
                    setDragging(false);
                }
            }
        }, []);

        return (
            <div className=' w-full h-full p-1' ref={ref}>
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
                        <div className=' absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-xs w-fit'

                        >
                            <motion.div className=' bg-white p-1 w-fit shadow rounded-full'
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                <Icons.Upload className='h-10' />
                            </motion.div>
                            <div className=' text-center shadow w-fit bg-white rounded-2xl p-4'>
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
