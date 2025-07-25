import { setAppsMenuOpen } from "@/redux/features/skydock/skydockSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Icons } from "@skydock/ui/icons";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Search, User } from "lucide-react";
import { useRef, useState } from "react";
import useAppProcess from "../hooks/useAppProcess";
import useOnClickOutside from "../hooks/useOnclickOutside";
import useSkydockSystem from "../hooks/useSkydockSystem";
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
        pdfReaderApp,
        notePadApp,
    } = useAppProcess();

    const { signOutFunction } = useSkydockSystem();

    const pinnedApps = [
        { id: 1, name: "Explorer", Icon: Icons.Folder, open: explorerApp.open },
        { id: 2, name: "Image Viewer", Icon: Icons.Image, open: imageViewerApp.open },
        { id: 3, name: "Music Player", Icon: Icons.Music, open: musicPlayerApp.open },
        { id: 4, name: "Settings", Icon: Icons.Settings2, open: settingsApp.open },
        { id: 5, name: "Terminal", Icon: Icons.Terminal, open: terminalApp.open },
        { id: 6, name: "Video Player", Icon: Icons.Video, open: videoPlayerApp.open },
        { id: 7, name: "PDF Reader", Icon: Icons.PDF, open: pdfReaderApp.open },
        { id: 8, name: "Note Pad", Icon: Icons.Notepad, open: notePadApp.open },

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
            className="bg-white/40 z-30 fixed bottom-[5.8rem] left-0 right-0 mx-auto  backdrop-blur-md  rounded-3xl shadow border border-transparent max-w-md min-h-[50vh] max-h-[60vh] overflow-hidden"
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
                    <div className="grid grid-cols-4 p-1 gap-2">
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
            <div className="p-3 border-t">
                <div className="relative mb-3 rounded-3xl bg-white/20 backdrop-blur-md  shadow-inner">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 "
                        size={18}
                    />
                    <Input
                        type="text"
                        placeholder="Type here to search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                        className="pl-10 h-10 border-none rounded-3xl text-sm text-gray-900 placeholder:text-gray-700  transition-colors"
                    />
                </div>

                {/* Bottom Section with User */}
                <div className="flex items-center justify-between">
                    <div className="flex rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 items-center space-x-2">
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
                        <span className="text-sm pr-2 font-medium text-gray-900">
                            {user?.name}
                        </span>
                    </div>
                    <Button
                        // whileHover={{ scale: 1.05 }}
                        // whileTap={{ scale: 0.95 }}
                        onClick={signOutFunction}
                        intent={'destructive'}
                        className=" rounded-xl p-2 hover:text-white text-gray-900 "
                    >
                        <LogOut size={16} />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default AppsMenu;
