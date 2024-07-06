import React, { forwardRef, ReactNode, useState } from 'react'
import { Icons } from '../icons'
import { motion } from 'framer-motion';
import cn from '../utils';

interface DragDropWrapperProps {
    children?: ReactNode
    handlefiles?: (files: File[]) => void
}

export const DragDropWrapper = forwardRef<HTMLDivElement, DragDropWrapperProps>(
    ({ children, handlefiles }, ref) => {
        const [files, setFiles] = useState<File[]>([])
        const [dragging, setDragging] = useState(false)

        const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault()
            const target = e.target as HTMLElement;
            if (target.dataset.type === 'pdf') {
                setDragging(true)
            }

            // console.log(target?.dataset?.type)
        }

        const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault()
            const files = Array.from(e.dataTransfer.files)
            handlefiles && handlefiles(files);
            setDragging(false)
        }
        return (
            <div className=' w-full h-full p-1'>
                <div className={cn('w-full h-full relative rounded-2xl p-0.5 transition-colors duration-300 ',
                    dragging ? ' z-50 border-2 border-dashed backdrop-blur bg-white/20 border-gray-400' : '',

                )}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragEnter={() => setDragging(true)}
                    onDragLeave={() => setDragging(false)}
                >
                    {children}
                    {dragging && (
                        <div className=' absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-xs w-fit'>
                            <motion.div className=' bg-white p-1 w-fit shadow rounded-full'

                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                <Icons.Upload className='h-10' />
                            </motion.div>
                            <div className=' text-center shadow w-fit bg-white rounded-2xl p-4'>
                                <div>Drag and drop your files here</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    });
