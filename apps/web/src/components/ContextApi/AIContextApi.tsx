import { setAiChatBoxOpen } from "@/redux/features/ai/aiSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createContext, FC, PropsWithChildren, useEffect } from "react";
import ChatBox from "../Ai/ChatBox";

export const AIContextAPI = createContext<null>(null);

export const AIContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const isAiChatBoxOpen = useAppSelector((state) => state.ai.chatBoxOpen);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                dispatch(setAiChatBoxOpen(!isAiChatBoxOpen));
            }

            if (e.key === 'Escape' && isAiChatBoxOpen) {
                dispatch(setAiChatBoxOpen(false));
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isAiChatBoxOpen]);

    return (
        <AIContextAPI.Provider value={null}>
            {/* Your AI context provider logic goes here */}
            {children}
            <ChatBox isOpen={isAiChatBoxOpen} onClose={() => dispatch(setAiChatBoxOpen(false))} />
        </AIContextAPI.Provider>
    );
}
