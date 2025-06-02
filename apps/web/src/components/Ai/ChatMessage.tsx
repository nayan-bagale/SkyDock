import { Bot, User } from 'lucide-react';

interface Message {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

interface ChatMessageProps {
    message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
    const isAI = message.sender === 'ai';

    return (
        <div className={`flex items-start gap-3 animate-fade-in ${isAI ? '' : 'flex-row-reverse'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${isAI
                ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                : 'bg-gradient-to-r from-green-500 to-blue-500'
                }`}>
                {isAI ? (
                    <Bot className="w-4 h-4 text-white" />
                ) : (
                    <User className="w-4 h-4 text-white" />
                )}
            </div>

            <div className={`rounded-2xl px-4 py-3 max-w-[80%] backdrop-blur-sm border ${isAI
                ? 'bg-white/20 text-white border-white/10'
                : 'bg-gradient-to-r from-blue-500/80 to-purple-600/80 text-white border-white/20'
                }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 ${isAI ? 'text-white/60' : 'text-white/80'
                    }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
        </div>
    );
};

export default ChatMessage;