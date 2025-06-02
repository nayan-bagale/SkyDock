import { useEffect, useRef, useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { motion } from 'framer-motion';
import { Bot, Paperclip, Send, X } from 'lucide-react';
import ChatMessage from './ChatMessage';

interface Message {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

interface ChatBoxProps {
    isOpen: boolean;
    onClose: () => void;
}

const ChatBox = ({ isOpen, onClose }: ChatBoxProps) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            content: 'Hello! I\'m your AI assistant. How can I help you today?',
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            setIsClosing(false);
            setIsVisible(true);
            setTimeout(() => {
                inputRef.current?.focus();
            }, 300);
        } else if (isVisible) {
            setIsClosing(true);
            setTimeout(() => {
                setIsVisible(false);
                setIsClosing(false);
            }, 300);
        }
    }, [isOpen, isVisible]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: `I understand you said: "${userMessage.content}". As an AI assistant, I'm here to help with any questions or tasks you might have. What would you like to explore together?`,
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleAttachment = () => {
        // Create a file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.accept = 'image/*,application/pdf,.doc,.docx,.txt';

        fileInput.onchange = (e) => {
            const files = (e.target as HTMLInputElement).files;
            if (files && files.length > 0) {
                // For now, just show a message about the files
                const fileNames = Array.from(files).map(file => file.name).join(', ');
                const attachmentMessage: Message = {
                    id: Date.now().toString(),
                    content: `📎 Attached files: ${fileNames}`,
                    sender: 'user',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, attachmentMessage]);
            }
        };

        fileInput.click();
    };

    if (!isOpen && !isVisible) return null;

    return (
        <motion.div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 `}>
            {/* Backdrop */}
            <motion.div //${isVisible && !isClosing ? 'opacity-100' : 'opacity-0'}
                className={`absolute inset-0 bg-black/30 backdrop-blur-md transition-all duration-300 `}
                onClick={handleClose}
                initial={{ opacity: 0, }}
                animate={{ opacity: isVisible && !isClosing ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            />

            {/* Chat Container */}
            <div className={`relative flex flex-col w-full max-w-2xl h-[700px] mx-4 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 transition-all duration-300 transform ${isVisible && !isClosing ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
                }`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">AI Assistant</h3>
                            {/* <p className="text-sm text-white/60">Always ready to help</p> */}
                        </div>
                    </div>
                    <Button
                        intent="ghost"
                        size="sm"
                        onClick={handleClose}
                        className="hover:bg-white/10 rounded-lg text-white/80 hover:text-white"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 ">
                    {messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                    ))}

                    {isTyping && (
                        <div className="flex items-start gap-3 animate-fade-in">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 max-w-[80%] border border-white/10">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/10">
                    <div className="flex gap-3">
                        <Button
                            onClick={handleAttachment}
                            intent="ghost"
                            size="sm"
                            className="hover:bg-white/10 text-white/80 hover:text-white rounded-lg"
                            disabled={isTyping}
                        >
                            <Paperclip className="w-4 h-4" />
                        </Button>
                        <Input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me anything... (Press Enter to send)"
                            className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 focus:border-white/40 focus:ring-white/20 text-white placeholder:text-white/60"
                            disabled={isTyping}
                        />
                        <Button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg px-4 shadow-lg"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-white/50 mt-2 text-center">
                        Press <kbd className="px-1.5 py-0.5 text-xs font-semibold text-white/80 bg-white/10 border border-white/20 rounded backdrop-blur-sm">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 text-xs font-semibold text-white/80 bg-white/10 border border-white/20 rounded backdrop-blur-sm">K</kbd> to toggle chat
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default ChatBox;