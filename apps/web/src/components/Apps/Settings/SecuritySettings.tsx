import { setPin } from '@/redux/features/lockScreen/lockScreenSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Button } from '@/ui/button';
import { Icons } from '@skydock/ui/icons';
import { useState } from 'react';

const SecuritySettings = () => {
    const dispatch = useAppDispatch();
    const currentPin = useAppSelector(state => state.lockScreen.pin);
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [showPin, setShowPin] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSavePin = () => {
        if (newPin.length < 4) {
            setError('PIN must be at least 4 digits');
            return;
        }

        if (newPin !== confirmPin) {
            setError('PINs do not match');
            return;
        }

        dispatch(setPin(newPin));
        setNewPin('');
        setConfirmPin('');
        setError('');
        setSuccess('PIN updated successfully');

        setTimeout(() => {
            setSuccess('');
        }, 3000);
    };

    const handleRemovePin = () => {
        dispatch(setPin(''));
        setSuccess('PIN removed successfully');

        setTimeout(() => {
            setSuccess('');
        }, 3000);
    };

    return (
        <div className="p-4">
            <h2 className="mb-4 font-semibold text-xl">Security Settings</h2>

            <div className="mb-6">
                <h3 className="mb-2 font-medium text-lg">Screen Lock PIN</h3>
                <p className="mb-4 text-gray-600 text-sm">
                    {currentPin ? 'Change your PIN to secure your device' : 'Set a PIN to secure your device'}
                </p>

                <div className="space-y-4">
                    <div className="relative">
                        <label className="block mb-1 font-medium text-sm">New PIN</label>
                        <input
                            type={showPin ? "text" : "password"}
                            value={newPin}
                            onChange={(e) => setNewPin(e.target.value)}
                            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            placeholder="Enter new PIN"
                            maxLength={6}
                        />
                        <button
                            className="top-8 right-3 absolute text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPin(!showPin)}
                        >
                            {showPin ? <Icons.Closed_Eye className="w-5 h-5" /> : <Icons.Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-sm">Confirm PIN</label>
                        <input
                            type={showPin ? "text" : "password"}
                            value={confirmPin}
                            onChange={(e) => setConfirmPin(e.target.value)}
                            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            placeholder="Confirm new PIN"
                            maxLength={6}
                        />
                    </div>

                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}

                    <div className="flex gap-3">
                        <Button onClick={handleSavePin}>
                            {currentPin ? 'Update PIN' : 'Set PIN'}
                        </Button>

                        {currentPin && (
                            <Button onClick={handleRemovePin} intent="destructive">
                                Remove PIN
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div>
                <h3 className="mb-2 font-medium text-lg">Auto-Lock</h3>
                <p className="mb-4 text-gray-600 text-sm">
                    Set the time before your screen automatically locks
                </p>

                <select className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
                    <option value="1">1 minute</option>
                    <option value="5">5 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="never">Never</option>
                </select>
            </div>
        </div>
    );
};

export default SecuritySettings; 