import useAppProcess from "@/components/hooks/useAppProcess";
import useOutsideAlerter from "@/components/hooks/useOnclickOutside";
import { useLogOutApiMutation } from "@/redux/apis/userAuthApi";
import { logOut } from "@/redux/features/auth";
import { lockScreen } from "@/redux/features/lockScreen/lockScreenSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "@/ui/button";
import {
    MainDropDownMenu,
    MainMenuSeparator,
} from "@/ui/Cards/Menus/MainDropDownMenu/MainDropDownMenu";
import { changeBytes, getStorageUsage } from "@/utils/changeBytes";
import { Icons } from "@skydock/ui/icons";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";

const ProfileDropdown = () => {
    const [show, setShow] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useOutsideAlerter(ref, () => setShow(false));
    const dispatch = useAppDispatch();

    const [logOutApi] = useLogOutApiMutation();
    const signOut = () => logOutApi("").then(() => dispatch(logOut()));

    const user = useAppSelector((state) => state.auth.user);

    const usedPercentage = getStorageUsage(
        user?.plan.storageLimit ?? 0,
        user?.usedStorage ?? 0
    ).usedPercentage;

    const toggleDropdown = () => {
        setShow(!show);
    };

    const handleLockScreen = () => {
        setShow(false);
        dispatch(lockScreen());
    };

    const { settingsApp } = useAppProcess();

    return (
        <div className="relative">
            <Button className="" onClick={toggleDropdown}>
                <Icons.User className="h-5" />
            </Button>
            <AnimatePresence>
                {show && (
                    <MainDropDownMenu ref={ref} className="right-0 z-30 rounded-xl">
                        {/* <div className="right-0 absolute bg-gradient-to-r from-pink-500/50 via-purple-500/50 to-indigo-500/50 shadow-xl backdrop-blur-lg mt-2 py-2 border border-gray-100 rounded-lg w-64"> */}
                        <div className="px-4 py-2">
                            {user?.picture ? (
                                <img src={user.picture} alt="Profile" className="mx-auto h-24 rounded-full" />

                            ) : (

                                <Icons.User className="mx-auto h-12" />
                            )}
                            <div className="mt-2 text-center">
                                <p className="font-semibold text-lg">{user?.name}</p>
                                <p className="text-gray-600 text-sm">{user?.email}</p>
                            </div>
                        </div>
                        <div className="px-4 py-2">
                            <div className="bg-gray-200 dark:bg-gray-300 rounded-full w-full h-2">
                                <motion.div
                                    className="bg-blue-600 rounded-full h-2"
                                    initial={{
                                        width: "0%",
                                    }}
                                    animate={{ width: `${usedPercentage}%` }}
                                ></motion.div>
                            </div>
                            <p className="mt-2 text-gray-600 text-xs">
                                {changeBytes(user?.usedStorage ?? 0)} of{" "}
                                {changeBytes(user?.plan.storageLimit ?? 0)}
                            </p>
                        </div>
                        {/* <div className="px-4 py-2">
                        <Button size={'cta'} intent={'cta'}>
                            Upgrade Plan
                        </Button>
                    </div> */}
                        <MainMenuSeparator />
                        <div className="grid grid-cols-2 gap-2 w-full px-4 py-1">
                            <Button
                                onClick={settingsApp.open}
                                className="p-1 gap-2 rounded-full w-full hover:bg-blue-400 hover:text-white"
                            >
                                <Icons.Settings className="h-4" /> Settings
                            </Button>
                            {/* <Button className="p-1 gap-2 rounded-full w-full" onClick={handleLockScreen}>
                            <Icons.Lock className="h-5" />
                        </Button> */}
                            <Button
                                onClick={signOut}
                                className="hover:bg-red-600 hover:text-white rounded-full p-1 gap-2 w-full"
                            >
                                <Icons.Logout className="h-5" /> Logout
                            </Button>
                        </div>
                        {/* </div> */}
                    </MainDropDownMenu>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileDropdown;
