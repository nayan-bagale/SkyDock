import { attemptUnlock, unlockScreen } from '@/redux/features/lockScreen/lockScreenSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Button } from '@/ui/button';
import { Icons } from '@skydock/ui/icons';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const LockScreen = () => {
    const dispatch = useAppDispatch();
    const { isLocked, pin, attempts, maxAttempts, lockTime } = useAppSelector(state => state.lockScreen);
    const [inputPin, setInputPin] = useState('');
    const [error, setError] = useState('');
    const [showPin, setShowPin] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Format time as HH:MM
    const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

    const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputPin(e.target.value);
        setError('');
    };

    const handleUnlock = () => {
        if (!pin) {
            // If no PIN is set, just unlock
            dispatch(unlockScreen());
            return;
        }

        if (inputPin === pin) {
            dispatch(unlockScreen());
            setInputPin('');
        } else {
            setError('Incorrect PIN');
            dispatch(attemptUnlock(inputPin));
            setInputPin('');

            // If max attempts reached, show error message
            if (attempts + 1 >= maxAttempts) {
                setError('Too many attempts. Try again later.');
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleUnlock();
        }
    };

    if (!isLocked) return null;

    return (
        <motion.div
            className="z-50 fixed inset-0 flex flex-col justify-center items-center bg-black/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="flex flex-col justify-center items-center gap-8 text-white">
                <div className="flex flex-col items-center">
                    <h1 className="font-light text-6xl">{formattedTime}</h1>
                    <p className="mt-2 text-xl">{formattedDate}</p>
                </div>

                <div className="flex flex-col items-center mt-8 w-64">
                    <div className="relative w-full">
                        <input
                            type={showPin ? "text" : "password"}
                            value={inputPin}
                            onChange={handlePinChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter PIN"
                            className="bg-white/10 px-4 py-2 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-white"
                            maxLength={6}
                            autoFocus
                        />
                        <button
                            className="top-2.5 right-3 absolute text-white/70 hover:text-white"
                            onClick={() => setShowPin(!showPin)}
                        >
                            {showPin ? <Icons.Closed_Eye className="w-5 h-5" /> : <Icons.Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    {error && <p className="mt-2 text-red-500">{error}</p>}

                    <Button
                        onClick={handleUnlock}
                        className="bg-blue-600 hover:bg-blue-700 mt-4 py-2 rounded w-full text-white"
                    >
                        Unlock
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default LockScreen; 