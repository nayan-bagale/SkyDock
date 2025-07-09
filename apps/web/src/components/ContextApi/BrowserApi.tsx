import { createContext, ReactNode, useContext } from 'react';
import useCamera from '../hooks/apps/useCamera';

type BrowserAPIContextType = {
    camera: ReturnType<typeof useCamera>;
    // screen: ReturnType<typeof useScreenShareService>; // future
    // mic: ReturnType<typeof useMicService>; // future
};

export const BrowserAPIContext = createContext<BrowserAPIContextType | undefined>(undefined);

export const BrowserAPIProvider = ({ children }: { children: ReactNode }) => {
    const camera = useCamera();

    const value: BrowserAPIContextType = {
        camera,
        // screen: useScreenShareService(),
        // mic: useMicService(),
    };

    return (
        <BrowserAPIContext.Provider value={value}>
            {children}
        </BrowserAPIContext.Provider>
    );
};

export function useBrowserAPI() {
    const context = useContext(BrowserAPIContext);
    if (!context) {
        throw new Error('useBrowserAPI must be used within BrowserAPIProvider');
    }
    return context;
}
