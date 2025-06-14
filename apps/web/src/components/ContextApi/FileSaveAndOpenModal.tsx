import { useAppSelector } from "@/redux/hooks";
import { FileT } from "@/types/explorer";
import FileSaveAndOpenModal from "@/ui/FileSaveAndOpenModal/FileSaveAndOpenModal";
import { FolderT } from "@skydock/types";
import { AppsT } from "@skydock/types/enums";
import { AnimatePresence } from "framer-motion";
import { createContext, useCallback, useEffect, useState } from "react";

interface ContextType {
    openFileOpenerModal: ({ app, onSuccess, onClose }: { app: keyof typeof AppsT, onSuccess: (item: FileT | FolderT) => void, onClose: () => void }) => void;
    openSaveFileModal: ({ app, onSuccess, onClose }: { app: keyof typeof AppsT, onSuccess: (item: FileT | FolderT) => void, onClose: () => void }) => void;
}

export const FileSaveAndOpenModalContext = createContext<ContextType>({
    openFileOpenerModal({ app, onSuccess, onClose }) {

    },
    openSaveFileModal({ app, onSuccess, onClose }) {

    },
});

export const FileSaveAndOpenModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [focusedAppId, setFocusedAppId] = useState<string | null>(null);
    const focusedApp = useAppSelector((state) => state.apps.focusedApp);
    const [action, setAction] = useState<'open' | 'save'>('open');
    const [onSuccess, setOnSuccess] = useState<((item: FileT | FolderT) => void) | null>(null);
    const [onClose, setOnClose] = useState<(() => void) | null>(null);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setFocusedAppId(null);
        setAction('open');
        setOnSuccess(null);
        if (onClose) {
            onClose();
        }
        // Reset the onClose function to avoid memory leaks
        setOnClose(null)
    }, [onClose])

    useEffect(() => {
        if (focusedAppId && focusedAppId !== focusedApp) {
            closeModal()
        }

    }, [closeModal, focusedApp, focusedAppId]);

    const openFileOpenerModal: ContextType['openFileOpenerModal'] = ({ app, onSuccess, onClose }) => {
        setIsOpen(true);
        setFocusedAppId(app);
        setAction('open');
        setOnSuccess(() => onSuccess);
        setOnClose(() => onClose)
    }

    const openSaveFileModal: ContextType['openSaveFileModal'] = ({ app, onSuccess, onClose }) => {
        setIsOpen(true);
        setFocusedAppId(app);
        setAction('save');
        setOnSuccess(() => onSuccess);
        setOnClose(() => onClose)
    }

    const handleSuccess = useCallback((item: FileT | FolderT) => {
        if (onSuccess) {
            onSuccess(item);
        }
        closeModal();
    }, [closeModal, onSuccess]);



    return (
        <FileSaveAndOpenModalContext.Provider value={{
            openFileOpenerModal,
            openSaveFileModal,
        }}>
            {children}
            {isOpen &&
                <AnimatePresence>
                    <FileSaveAndOpenModal closeModal={closeModal} onSuccess={handleSuccess} action={action} />
                </AnimatePresence>}
        </FileSaveAndOpenModalContext.Provider>
    );
}