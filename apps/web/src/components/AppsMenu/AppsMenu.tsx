import { setAppsMenuOpen } from "@/redux/features/skydock/skydockSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Input } from "@/ui/input";
import { Icons } from "@skydock/ui/icons";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Search, User } from "lucide-react";
import { useRef, useState } from "react";
import useAppProcess from "../hooks/useAppProcess";
import useOnClickOutside from "../hooks/useOnclickOutside";
import { AppCard } from "./AppCard";

const AppsMenu = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useAppDispatch();
    const ref = useRef<HTMLDivElement>(null);
    const user = useAppSelector((state) => state.auth.user);
    const {
        explorerApp,
        imageViewerApp,
        musicPlayerApp,
        settingsApp,
        terminalApp,
        videoPlayerApp,
    } = useAppProcess();

    const pinnedApps = [
        { id: 1, name: "Explorer", Icon: Icons.Folder, open: explorerApp.open },
        { id: 2, name: "Image Viewer", Icon: Icons.Image, open: imageViewerApp.open },
        { id: 3, name: "Music Player", Icon: Icons.Music, open: musicPlayerApp.open },
        { id: 4, name: "Settings", Icon: Icons.Settings2, open: settingsApp.open },
        { id: 5, name: "Terminal", Icon: Icons.Terminal, open: terminalApp.open },
        { id: 6, name: "Video Player", Icon: Icons.Video, open: videoPlayerApp.open },
    ];

    useOnClickOutside(ref, () => {
        dispatch(setAppsMenuOpen(false));
    });

    const filteredApps = pinnedApps.filter((app) =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.2,
                ease: "easeOut",
            },
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: 20,
            transition: { duration: 0.15 },
        },
    };

    return (
        <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white/60 z-30 fixed bottom-[5.8rem] left-0 right-0 mx-auto  backdrop-blur-md  rounded-2xl shadow border border-white/20 w-full max-w-md min-h-[50vh] max-h-[60vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Apps Section */}
            <div className="p-4 pb-2">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-900">Apps</h3>
                    {/* <button className="flex items-center text-xs text-gray-600 hover:text-gray-900 transition-colors">
                        All apps <ChevronRight size={14} className="ml-1" />
                    </button> */}
                </div>

                <motion.div
                    layout
                    className="max-h-[calc(60vh-160px)] min-h-[calc(50vh-160px)] overflow-x-hidden overflow-y-auto"
                >
                    <div className="grid grid-cols-4 gap-2">
                        <AnimatePresence>
                            {filteredApps.map((app, index) => {
                                const appOpen = app.open;
                                app.open = () => {
                                    appOpen();
                                    dispatch(setAppsMenuOpen(false));
                                }

                                return (
                                    <AppCard key={app.id} app={app} index={index} />
                                )
                            })}
                            {/* {searchTerm && filteredApps.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ delay: filteredApps.length === 0 ? 0.5 : 0 }}
                                    className="col-span-4 text-center text-gray-500 text-sm mt-4"
                                >
                                    No apps found for "{searchTerm}"
                                </motion.div>
                            )} */}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>

            {/* Search at bottom */}
            <div className="p-3 pt-2 border-t border-gray-200">
                <div className="relative mb-3">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={18}
                    />
                    <Input
                        type="text"
                        placeholder="Type here to search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-10 bg-gray-50 border-gray-300 rounded-3xl text-sm text-gray-900 placeholder:text-gray-500 focus:bg-white transition-colors"
                    />
                </div>

                {/* Bottom Section with User */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            {user?.picture ? (
                                <img
                                    src={user.picture}
                                    alt="Profile"
                                    className="mx-auto h-8 rounded-full"
                                />
                            ) : (
                                <User size={16} className="text-white" />
                            )}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                            {user?.name}
                        </span>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <LogOut size={16} className="text-gray-600 hover:text-red-500" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default AppsMenu;
