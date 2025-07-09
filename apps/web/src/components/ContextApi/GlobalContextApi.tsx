import { FC, PropsWithChildren } from 'react'
import { BrowserAPIProvider } from './BrowserApi'
import { ConfirmModalProvider } from './ConfirmModal'
import { FileSaveAndOpenModalProvider } from './FileSaveAndOpenModal'

const GlobalContextApi: FC<PropsWithChildren> = ({ children }) => {
    return (
        <BrowserAPIProvider>
            <ConfirmModalProvider>
                <FileSaveAndOpenModalProvider>
                    {/* <AIContextProvider> */}
                    {children}
                    {/* </AIContextProvider> */}
                </FileSaveAndOpenModalProvider>
            </ConfirmModalProvider>
        </BrowserAPIProvider>
    )
}

export default GlobalContextApi