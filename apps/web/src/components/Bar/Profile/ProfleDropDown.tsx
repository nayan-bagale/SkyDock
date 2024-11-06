import useOutsideAlerter from "@/components/hooks/useOnclickOutside";
import { useLogOutApiMutation } from "@/redux/APISlice";
import { logOut } from "@/redux/features/auth";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from '@/ui/button';
import { MainDropDownMenu, MainMenuSeparator } from "@/ui/Cards/Menus/MainDropDownMenu/MainDropDownMenu";
import { Icons } from '@repo/ui/icons';
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

    return (
        <div className="relative">
            <Button className=""
                onClick={toggleDropdown}
            >
                <Icons.User className="h-5" />

            </Button>
            {show && (
                <MainDropDownMenu ref={ref} className=" right-0">
                    {/* <div className="absolute right-0 mt-2 py-2 w-64 bg-gradient-to-r from-pink-500/50 via-purple-500/50 to-indigo-500/50 backdrop-blur-lg rounded-lg shadow-xl border border-gray-100"> */}
                    <div className="px-4 py-2">
                        <Icons.User className="h-12 mx-auto" />
                        {/* <img src="https://picsum.photos/64/64" alt="Profile" className="rounded-full mx-auto" /> */}
                        <div className="text-center mt-2">
                            <p className="text-lg font-semibold">{user?.name}</p>
                            <p className="text-sm text-gray-600">{user?.email}</p>
                        </div>
                    </div>
                    <div className="px-4 py-2">
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-300">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">250mb of 500mb used</p>
                    </div>
                    <div className="px-4 py-2">
                        <Button size={'cta'} intent={'cta'}>
                            Upgrade Plan
                        </Button>
                    </div>
                    <MainMenuSeparator />
                    <div className="px-4 flex justify-between">
                        <Button className=" p-1">
                            <Icons.Settings className="h-4" />
                        </Button>
                        <Button className=" p-1">
                            <Icons.Lock className="h-5" />
                        </Button>
                        <Button onClick={signOut} className=" p-1 hover:bg-red-600">
                            <Icons.Logout className="h-5 " />
                        </Button>
                    </div>
                    {/* </div> */}
                </MainDropDownMenu>
            )}
        </div>
    );
};

export default ProfileDropdown;
