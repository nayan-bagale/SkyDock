import { FC, PropsWithChildren } from 'react'
import { ConfirmModalProvider } from './ConfirmModal'
import { FileSaveAndOpenModalProvider } from './FileSaveAndOpenModal'

const GlobalContextApi: FC<PropsWithChildren> = ({ children }) => {
    return (
        <ConfirmModalProvider>
            <FileSaveAndOpenModalProvider>
                {/* <AIContextProvider> */}
                {children}
                {/* </AIContextProvider> */}
            </FileSaveAndOpenModalProvider>
        </ConfirmModalProvider>
    )
}

export default GlobalContextApi