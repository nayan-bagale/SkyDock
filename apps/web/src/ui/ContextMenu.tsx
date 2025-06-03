import useOnClickOutside from "@/components/hooks/useOnclickOutside"
import { Icons } from "@skydock/ui/icons"
import { AnimatePresence, motion } from "framer-motion"
import { FC, forwardRef, ReactNode, useEffect, useMemo, useRef, useState } from "react"
import cn from "../utils"
import { Button } from "./button"

interface ContextMenuT {
    children?: ReactNode
    className?: string
    position?: { x: number, y: number }
    close: () => void

}

export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuT>(
    ({ children, className, position, close }, ref) => {
        const [windowWidth, setWindowWidth] = useState(window.innerWidth);
        const [windowHeight, setWindowHeight] = useState(window.innerHeight);
        const [elementHeight, setElementHeight] = useState(100); // Default height for the context menu
        const [elementWidth, setElementWidth] = useState(160); // Default width for the context menu


        const localRef = useRef<HTMLDivElement>(null);


        useOnClickOutside(localRef, close);

        const observer = () => {
            if (!localRef.current) {
                return () => { };
            }
            const observe = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    if (entry.target === localRef.current) {
                        const { height, width } = entry.contentRect;
                        setElementHeight(height);
                        setElementWidth(width);
                    }
                }
            });
            observe.observe(localRef.current);
            return () => {
                observe.disconnect();
            }
        }


        useEffect(() => {
            const handleResize = () => {
                setWindowWidth(window.innerWidth);
                setWindowHeight(window.innerHeight);
            };

            window.addEventListener('resize', handleResize);

            const resizeObserverCleanup = observer();

            return () => {
                window.removeEventListener('resize', handleResize);
                resizeObserverCleanup();
            };
        }, []);

        const finalPosition = useMemo(() => {
            if (!position) return { x: 0, y: 0 };

            let x = position.x;
            let y = position.y;
            if (x + elementWidth > windowWidth) {
                x = windowWidth - elementWidth - 5;
            }

            if (y + elementHeight > windowHeight) {
                y = windowHeight - elementHeight - 10;
            }

            return { x, y };
        }, [position, elementWidth, windowWidth, elementHeight, windowHeight]);

        return (
            <AnimatePresence>
                <motion.div className={cn("bg-gray-50 py-1 px-0.5 text-xs min-w-[10rem] gap-1 shadow-md flex flex-col rounded", className)}
                    ref={localRef}
                    style={{
                        left: finalPosition?.x,
                        top: finalPosition?.y,
                        zIndex: 9999,
                        position: 'absolute'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        )
    })

export const ContextMenuSeparator = () => {
    return (
        <div className="mx-auto border-gray-400 border-b w-[calc(100%-1rem)]" ></div>
    )
}

interface ContextMenuSubT {
    children: ReactNode
    name: string
    position?: 'left' | 'right' | 'bottom'
}

export const ContextMenuSub: FC<ContextMenuSubT> = ({
    children,
    name,
    position = 'left'
}) => {
    const [show, setShow] = useState(false);

    let pos = '';
    switch (position) {
        case 'left':
            pos = 'top-0 -right-[9.5rem]'
            break;
        case 'right':
            pos = ' top-0 -left-[9.5rem] '
            break;
        case 'bottom':
            pos = 'top-5'
            break;
    }

    return (
        <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} >
            <Button size={'menu'} isActive={show} >
                <div>{name}</div>
                <Icons.Right_Arrow className="h-4" />
            </Button>
            {show && (
                <AnimatePresence>
                    <motion.div className={cn(
                        "z-10 absolute  bg-gray-100 border py-1 px-0.5 text-xs min-w-[10rem] gap-1 shadow-md flex flex-col rounded",
                        pos
                    )}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    )
}


