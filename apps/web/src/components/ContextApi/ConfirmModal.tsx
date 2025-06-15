import ConfirmationCard from "@/ui/ConfirmModal/ConfirmationCard";
import { AnimatePresence } from "framer-motion";
import { createContext, ReactNode, useState } from "react";

export const ConfirmModalContext = createContext<{
    open: (title: string, message: string, type: string, onConfirm: () => void, onCancel?: () => void) => void;
    close: () => void;
}>({
    open: () => { },
    close: () => { }
});


export const ConfirmModalProvider = ({ children }: { children: ReactNode }) => {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [onConfirm, setOnConfirm] = useState<() => void>(() => () => { });
    const [onCancel, setOnCancel] = useState<() => void>(() => () => { });
    const [type, setType] = useState<string>("info");
    const [isOpen, setIsOpen] = useState(false);
    const open = (title: string, message: string, type: string, onConfirm: () => void, onCancel?: () => void) => {
        // Logic to open the modal with the provided title, message, and callbacks
        setIsOpen(true);
        setTitle(title);
        setMessage(message);
        setType(type);
        setOnConfirm(() => onConfirm);
        setOnCancel(() => onCancel || (() => { }));
        console.log('Modal opened with title:', title, 'message:', message, 'type:', type);

    };

    const close = () => {
        // Logic to close the modal
        setIsOpen(false);
        setTitle("");
        setMessage("");
        setOnConfirm(() => () => { });
        setOnCancel(() => () => { });
        setType("info");
    };

    return (
        <ConfirmModalContext.Provider value={{ open, close }}>
            {/* Your modal component goes here */}
            {children}
            <AnimatePresence>
                {isOpen && <ConfirmationCard
                    title={title}
                    message={message}
                    theme={type as 'info' | 'destructive' | 'primary'}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                />}
            </AnimatePresence>
        </ConfirmModalContext.Provider>
    );
}

