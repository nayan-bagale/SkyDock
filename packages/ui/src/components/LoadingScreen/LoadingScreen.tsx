import React, { useEffect, useState } from 'react';
import CloudAnimation from './CloudAnimation';
import Logo from './Logo';

interface LoadingScreenProps {
    onFinishLoading?: () => void;
    autoFinish?: boolean;
    finishAfter?: number; // in milliseconds
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
    onFinishLoading,
    autoFinish = true,
    finishAfter = 3000
}) => {
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('Loading');

    useEffect(() => {
        const texts = ['Initializing', 'Loading resources', 'Preparing clouds', 'Almost ready'];
        let textIndex = 0;

        // Update loading text
        const textInterval = setInterval(() => {
            textIndex = (textIndex + 1) % texts.length;
            setLoadingText(texts[textIndex]);
        }, 800);

        // Progress animation
        const startTime = Date.now();
        const endTime = startTime + finishAfter;

        const progressInterval = setInterval(() => {
            const now = Date.now();
            const elapsed = now - startTime;
            const newProgress = Math.min(100, (elapsed / finishAfter) * 100);

            setProgress(newProgress);

            if (newProgress >= 100 && autoFinish) {
                clearInterval(progressInterval);
                clearInterval(textInterval);
                onFinishLoading?.();
            }
        }, 50);

        return () => {
            clearInterval(textInterval);
            clearInterval(progressInterval);
        };
    }, [finishAfter, autoFinish, onFinishLoading]);

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#1A1F2C] text-white overflow-hidden z-50">
            <CloudAnimation />

            <div className="relative z-10 flex flex-col items-center justify-center gap-8 px-6">
                <div className="animate-bounce-slow">
                    <Logo size={180} />
                </div>

                <div className="flex flex-col items-center gap-3 mt-4">
                    <div className="text-xl font-medium tracking-wide text-white/90">{loadingText}</div>

                    <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white/80 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="text-sm font-light text-white/60">SkyDock</div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;