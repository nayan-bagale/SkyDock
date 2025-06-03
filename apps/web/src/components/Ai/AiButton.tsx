import { setAiChatBoxOpen } from "@/redux/features/ai/aiSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Button } from "@/ui/button";
import { Sparkles } from "lucide-react";

const AiButton = () => {
    const dispatch = useAppDispatch();
    return (
        <Button
            onClick={() => dispatch(setAiChatBoxOpen(true))} //bg-gradient-to-br from-red-500 to-indigo-700
            className=" fixed bottom-8 right-4 md:right-8 p-3 gap-1 text-white h-10 border border-white/10 bg-white/20 backdrop-blur hover:bg-white/30 rounded-2xl flex items-center justify-center shadow"
        >
            {/* <Bot className="w-5 h-5 text-white" /> */}
            <span className="hidden md:block">Ask Sky</span>
            <Sparkles className="text-white h-10 md:h-5" />
        </Button>
    );
};

export default AiButton;
