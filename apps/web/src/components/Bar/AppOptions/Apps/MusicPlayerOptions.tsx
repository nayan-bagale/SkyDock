import useMusicPlayer from "@/components/hooks/apps/useMusicPlayer";
import useOnClickOutside from "@/components/hooks/useOnclickOutside";
import { Button } from "@/ui/button";
import {
    MainDropDownMenu,
    MainMenuSeparator,
} from "@/ui/Cards/Menus/MainDropDownMenu/MainDropDownMenu";
import { AnimatePresence, motion } from "framer-motion";
import { Download, File } from "lucide-react";
import { useRef, useState } from "react";

const MusicPlayerOptions = () => {
    const [show, setShow] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useOnClickOutside(ref, () => setShow(false));
    const { openMusicFileUsingModal, download, close, musicFileInfo } = useMusicPlayer();

    return (
        <motion.div
            className=" relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Button size={"small"} className="" onClick={() => setShow(true)}>
                File
            </Button>
            <AnimatePresence>
                {show && (
                    <MainDropDownMenu ref={ref} className=" right-2/4 translate-x-2/4">
                        <Button
                            size={"menu"}
                            onClick={() => {
                                setShow(false);
                                openMusicFileUsingModal();
                            }}
                            className=" "
                        >
                            <div>Open File</div>
                            <File className="h-4" />

                        </Button>
                        <MainMenuSeparator />
                        <Button
                            size={"menu"}
                            disabled={!musicFileInfo}

                            onClick={() => {
                                setShow(false);
                                download();
                            }}
                            className=" "
                        >
                            <div>Download</div>
                            {/* <Icons.Download className="h-4" /> */}
                            <Download className="h-4" />
                        </Button>
                        <MainMenuSeparator />
                        <Button
                            size={"menu"}
                            onClick={() => {
                                setShow(false);
                                close();
                            }}
                            className=" "
                        >
                            Exit
                        </Button>
                        {/* <SubDropDownMenu name="Date" position="left">
                        <Button size={'menu'} className=" ">
                            Date
                        </Button>
                    </SubDropDownMenu> */}
                    </MainDropDownMenu>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default MusicPlayerOptions;
