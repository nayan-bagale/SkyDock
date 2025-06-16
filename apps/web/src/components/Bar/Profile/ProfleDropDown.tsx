import useAppProcess from "@/components/hooks/useAppProcess";
import useOutsideAlerter from "@/components/hooks/useOnclickOutside";
import useSkydockSystem from "@/components/hooks/useSkydockSystem";
import { lockScreen } from "@/redux/features/lockScreen/lockScreenSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "@/ui/button";
import cn from "@/utils";
import { changeBytes, getStorageUsage } from "@/utils/changeBytes";
import { Icons } from "@skydock/ui/icons";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Settings } from "lucide-react";
import { useRef, useState } from "react";

const ProfileDropdown = () => {
    const [show, setShow] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useOutsideAlerter(ref, () => setShow(false));
    const dispatch = useAppDispatch();

    const { signOutFunction } = useSkydockSystem();

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
                    <motion.div className={cn(" p-2 right-0 z-30 rounded-2xl backdrop-blur-2xl top-7 absolute bg-white/40  text-xs min-w-[14rem] gap-2 shadow-lg flex flex-col")}
                        ref={ref}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="px-4 shadow rounded-2xl backdrop-blur-md bg-white/10 border border-white/20  py-2">
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
                        <div className="px-4 py-2 shadow rounded-2xl backdrop-blur-md bg-white/10 border border-white/20">
                            <div className="bg-white rounded-full w-full h-2">
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
                        {/* <MainMenuSeparator /> */}
                        <div className="flex shadow rounded-2xl backdrop-blur-md bg-white/10 border border-white/20  gap-2 w-full ">
                            <Button
                                onClick={settingsApp.open}
                                className=" gap-1 p-2 rounded-l-full text-center w-full hover:bg-blue-400 hover:text-white"
                            >
                                <Settings className="ml- h-4" /> Settings
                            </Button>
                            <Button
                                onClick={signOutFunction}
                                className="hover:bg-red-600  hover:text-white text-center rounded-r-full flex gap-1 w-full"
                            >
                                <LogOut className="ml- h-4" /> Logout
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileDropdown;
