import { useEffect, useState } from 'react';

interface NetworkStatus {
    isOnline: boolean;
    isChecking: boolean;
    checkConnection: () => Promise<void>;
}

export const useNetworkStatus = (): NetworkStatus => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isChecking, setIsChecking] = useState(false);

    const checkConnection = async (): Promise<void> => {
        setIsChecking(true);

        try {
            // Try to fetch a small resource to verify actual connectivity
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch('/favicon.ico', {
                method: 'HEAD',
                cache: 'no-cache',
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            setIsOnline(response.ok);
        } catch (error) {
            console.log('Network check failed:', error);
            setIsOnline(false);
        } finally {
            setIsChecking(false);
        }
    };

    useEffect(() => {
        const handleOnline = () => {
            console.log('Browser detected online');
            setIsOnline(true);
        };

        const handleOffline = () => {
            console.log('Browser detected offline');
            setIsOnline(false);
        };

        // Listen for browser online/offline events
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Check connection on mount
        checkConnection();

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return {
        isOnline,
        isChecking,
        checkConnection
    };
};