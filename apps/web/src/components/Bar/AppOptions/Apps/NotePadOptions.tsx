import useNotePad from "@/components/hooks/apps/useNotePad";
import useOnClickOutside from "@/components/hooks/useOnclickOutside";
import { Button } from "@/ui/button";
import {
    MainDropDownMenu,
    MainMenuSeparator,
} from "@/ui/Cards/Menus/MainDropDownMenu/MainDropDownMenu";
import { AnimatePresence, motion } from "framer-motion";
import { Download, File, Save } from "lucide-react";
import { useRef, useState } from "react";

const NotePadOptions = () => {
    const [show, setShow] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useOnClickOutside(ref, () => setShow(false));
    const { saveAs, save, openFileUsingModal, close, download, fileInfo } =
        useNotePad();

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
                                openFileUsingModal();
                            }}
                            className=" "
                        >
                            <div>Open File</div>
                            <File className="h-4" />

                        </Button>
                        <MainMenuSeparator />
                        <Button
                            size={"menu"}
                            onClick={() => {
                                setShow(false);
                                save();
                            }}
                            className=" "
                        >
                            <div>Save</div>
                            <Save className="h-4" />
                        </Button>
                        <Button
                            size={"menu"}
                            onClick={() => {
                                setShow(false);
                                saveAs();
                            }}
                            className=" "
                        >

                            <div>Save As</div>
                        </Button>
                        <Button
                            size={"menu"}
                            disabled={!fileInfo}

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

export default NotePadOptions;
