import useOutsideAlerter from "@/components/hooks/useOnclickOutside";
import { useLogOutApiMutation } from "@/redux/APISlice";
import { logOut } from "@/redux/features/auth";
import { lockScreen } from "@/redux/features/lockScreen/lockScreenSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from '@/ui/button';
import { MainDropDownMenu, MainMenuSeparator } from "@/ui/Cards/Menus/MainDropDownMenu/MainDropDownMenu";
import { Icons } from '@skydock/ui/icons';
import { useRef, useState } from 'react';

const ProfileDropdown = () => {
    const [show, setShow] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useOutsideAlerter(ref, () => setShow(false));
    const dispatch = useAppDispatch();

    const [logOutApi] = useLogOutApiMutation();
    const signOut = () => logOutApi('').then(() => dispatch(logOut()))

    const user = useAppSelector(state => state.auth.user);

    const toggleDropdown = () => {
        setShow(!show);
    };

    const handleLockScreen = () => {
        setShow(false)
        dispatch(lockScreen());
    };

    return (
        <div className="relative">
            <Button className=""
                onClick={toggleDropdown}
            >
                <Icons.User className="h-5" />

            </Button>
            {show && (
                <MainDropDownMenu ref={ref} className="right-0">
                    {/* <div className="right-0 absolute bg-gradient-to-r from-pink-500/50 via-purple-500/50 to-indigo-500/50 shadow-xl backdrop-blur-lg mt-2 py-2 border border-gray-100 rounded-lg w-64"> */}
                    <div className="px-4 py-2">
                        <Icons.User className="mx-auto h-12" />
                        {/* <img src="https://picsum.photos/64/64" alt="Profile" className="mx-auto rounded-full" /> */}
                        <div className="mt-2 text-center">
                            <p className="font-semibold text-lg">{user?.name}</p>
                            <p className="text-gray-600 text-sm">{user?.email}</p>
                        </div>
                    </div>
                    <div className="px-4 py-2">
                        <div className="bg-gray-200 dark:bg-gray-300 rounded-full w-full h-2">
                            <div className="bg-blue-600 rounded-full h-2" style={{ width: '50%' }}></div>
                        </div>
                        <p className="mt-2 text-gray-600 text-xs">250mb of 500mb used</p>
                    </div>
                    <div className="px-4 py-2">
                        <Button size={'cta'} intent={'cta'}>
                            Upgrade Plan
                        </Button>
                    </div>
                    <MainMenuSeparator />
                    <div className="flex justify-between px-4">
                        <Button className="p-1">
                            <Icons.Settings className="h-4" />
                        </Button>
                        <Button className="p-1" onClick={handleLockScreen}>
                            <Icons.Lock className="h-5" />
                        </Button>
                        <Button onClick={signOut} className="hover:bg-red-600 p-1">
                            <Icons.Logout className="h-5" />
                        </Button>
                    </div>
                    {/* </div> */}
                </MainDropDownMenu>
            )}
        </div>
    );
};

export default ProfileDropdown;
