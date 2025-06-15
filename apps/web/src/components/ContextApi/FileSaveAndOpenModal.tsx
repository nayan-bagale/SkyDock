import { useAppSelector } from "@/redux/hooks";
import FileSaveAndOpenModal from "@/ui/FileSaveAndOpenModal/FileSaveAndOpenModal";
import { ExplorerItemT, FileDetailsT, FileSaveAndOpenModalT } from "@skydock/types";
import { AnimatePresence } from "framer-motion";
import { createContext, useCallback, useEffect, useState } from "react";


export const FileSaveAndOpenModalContext = createContext<FileSaveAndOpenModalT>({
    openFileOpenerModal({ appName, onSuccess, onClose }) {

    },
    openSaveFileModal({ appName, onSuccess, onClose }) {

    },
});

export const FileSaveAndOpenModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [focusedAppId, setFocusedAppId] = useState<string | null>(null);
    const focusedApp = useAppSelector((state) => state.apps.focusedApp);
    const [action, setAction] = useState<'open' | 'save'>('open');
    const [onSuccess, setOnSuccess] = useState<((item: ExplorerItemT | FileDetailsT) => void) | null>(null);
    const [onClose, setOnClose] = useState<(() => void) | null>(null);
    const [supportedMimeTypes, setSupportedMimeType] = useState<string[] | null>(null);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setFocusedAppId(null);
        setAction('open');
        setOnSuccess(null);
        if (typeof onClose === 'function') {
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

    const openFileOpenerModal: FileSaveAndOpenModalT['openFileOpenerModal'] = ({ appName, onSuccess, onClose, supportedMimeTypes }) => {
        setIsOpen(true);
        setFocusedAppId(appName);
        setAction('open');
        setOnSuccess(() => onSuccess);
        setOnClose(() => onClose)
        setSupportedMimeType(supportedMimeTypes || null);
    }

    const openSaveFileModal: FileSaveAndOpenModalT['openSaveFileModal'] = ({ appName, onSuccess, onClose, supportedMimeTypes }) => {
        setIsOpen(true);
        setFocusedAppId(appName);
        setAction('save');
        setOnSuccess(() => onSuccess);
        setOnClose(() => onClose)
        setSupportedMimeType(supportedMimeTypes || null);
    }

    const handleSuccess = useCallback((item: ExplorerItemT | FileDetailsT) => {
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
            <AnimatePresence>
                {isOpen &&
                    <FileSaveAndOpenModal supportedMimeTypes={supportedMimeTypes} closeModal={closeModal} onSuccess={handleSuccess} action={action} />
                }
            </AnimatePresence>
        </FileSaveAndOpenModalContext.Provider>
    );
}