import { Button } from '@/ui/button';
import { motion } from 'framer-motion';
import { RefreshCw, WifiOff } from 'lucide-react';
import React from 'react';

interface OfflinePageProps {
    onRetry: () => void;
    isRetrying?: boolean;
}

const OfflinePage: React.FC<OfflinePageProps> = ({ onRetry, isRetrying = false }) => {
    return (
        <motion.div className="min-h-screen transition-colors duration-300 bg-black/20 flex items-center justify-center p-4"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
        >
            <div className="max-w-md w-full text-center space-y-8">
                {/* Icon Container */}
                <div className="relative">
                    <div className="w-24 h-24 mx-auto bg-slate-200 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <WifiOff className="w-12 h-12 text-slate-500" />
                    </div>

                    {/* Subtle animation rings */}
                    <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full border-2 border-slate-300 animate-ping opacity-20"></div>
                    <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full border-2 border-slate-300 animate-ping opacity-10 animation-delay-1000"></div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        No Internet Connection
                    </h1>

                    {/* <p className="text-slate-100 leading-relaxed">
                        It looks like you're not connected to the internet. Please check your connection and try again.
                    </p> */}

                    <div className="text-sm text-slate-200 space-y-1">
                        <p>• Check your WiFi or mobile data</p>
                        <p>• Make sure airplane mode is off</p>
                        <p>• Try moving to a different location</p>
                    </div>
                </div>

                {/* Retry Button */}
                <div className="pt-4 flex justify-center">
                    <Button
                        onClick={onRetry}
                        disabled={isRetrying}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:transform-none"
                    >
                        {isRetrying ? (
                            <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Checking...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Try Again
                            </>
                        )}
                    </Button>
                </div>

                {/* Footer */}
                <div className="pt-8 text-xs text-slate-400">
                    <p>Unable to reach our servers</p>
                </div>
            </div>
        </motion.div>
    );
};

export default OfflinePage;