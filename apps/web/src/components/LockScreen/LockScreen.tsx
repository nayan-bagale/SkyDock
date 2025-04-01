import { attemptUnlock, unlockScreen } from '@/redux/features/lockScreen/lockScreenSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Button } from '@/ui/button';
import { Form } from '@/ui/Cards/AuthFlow/Form';
import { InputPassword } from '@/ui/input';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ErrorMessage from '../Auth/ErrorMessage';

const LockScreen = () => {
    const dispatch = useAppDispatch();
    const { pin, attempts, maxAttempts, lockTime } = useAppSelector(state => state.lockScreen);
    const [error, setError] = useState('');
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


    const handleUnlock = (e: any) => {
        e.preventDefault()
        const inputPin = e.target[0].value;
        if (!pin) {
            // If no PIN is set, just unlock
            dispatch(unlockScreen());
            return;
        }
        if (inputPin === pin) {
            dispatch(unlockScreen());
        } else {
            setError('Incorrect PIN');
            dispatch(attemptUnlock(inputPin));

            // If max attempts reached, show error message
            if (attempts + 1 >= maxAttempts) {
                setError('Too many attempts. Try again later.');
            }
        }
    };

    return (
        <motion.div
            className="z-50 fixed inset-0 flex flex-col justify-center items-center bg-black/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onContextMenu={(e) => e.preventDefault()}
        >
            <div className="flex flex-col justify-center items-center gap-8 text-white">
                <div className="flex flex-col items-center">
                    <h1 className="font-light text-6xl">{formattedTime}</h1>
                    <p className="mt-2 text-xl">{formattedDate}</p>
                </div>
                <Form onSubmit={handleUnlock}>
                    <InputPassword placeholder='pincode' />
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <Button size={'medium'} className="flex justify-center items-center bg-blue-600 hover:bg-blue-700 my-2 w-full text-white" intent={'secondary'} type="submit">
                        Unlock
                    </Button>
                </Form>
            </div>
        </motion.div>
    );
};

export default LockScreen; 