import { FC, PropsWithChildren } from 'react'
import { AIContextProvider } from './AIContextApi'
import { ConfirmModalProvider } from './ConfirmModal'

const GlobalContextApi: FC<PropsWithChildren> = ({ children }) => {
    return (
        <ConfirmModalProvider>
            <AIContextProvider>
                {children}
            </AIContextProvider>
        </ConfirmModalProvider>
    )
}

export default GlobalContextApi