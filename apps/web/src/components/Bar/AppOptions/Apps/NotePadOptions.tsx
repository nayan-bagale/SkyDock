import { FileSaveAndOpenModalContext } from "@/components/ContextApi/FileSaveAndOpenModal";
import useOnClickOutside from "@/components/hooks/useOnclickOutside";
import { useGetTextFileContentMutation } from "@/redux/apis/filesAndFolderApi";
import { openNotePad, openNotePadFileActionModal, setNotePadContent } from "@/redux/features/note-pad/notePadSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Button } from "@/ui/button";
import { MainDropDownMenu, MainMenuSeparator } from "@/ui/Cards/Menus/MainDropDownMenu/MainDropDownMenu";
import { FileT } from "@skydock/types";
import { AppsT, SupportedMimeTypes } from "@skydock/types/enums";
import { showToast } from "@skydock/ui/toast";
import { useContext, useRef, useState } from "react";

const NotePadOptions = () => {
    const [show, setShow] = useState(false);
    const ref = useRef<HTMLDivElement>(null)
    useOnClickOutside(ref, () => setShow(false));
    const dispatch = useAppDispatch();

    const { openFileOpenerModal, openSaveFileModal } = useContext(FileSaveAndOpenModalContext);
    const [getTextFileContent] = useGetTextFileContentMutation();

    const handleFileOpen = () => {
        dispatch(openNotePadFileActionModal(true));
        setShow(false)
        openFileOpenerModal({
            appName: AppsT.NotePad,
            onSuccess: async (e) => {

                dispatch(openNotePad(e as FileT))
                getTextFileContent(e.id)
                    .unwrap()
                    .then((content) => {
                        dispatch(setNotePadContent(content))
                    })
                    .catch((error) => {
                        console.error("Failed to fetch file content:", error);
                        showToast("Error fetching file content", "error");
                    });
            },
            onClose: () => {
                dispatch(openNotePadFileActionModal(false));
            },
            supportedMimeTypes: [SupportedMimeTypes.Text]
        })
    }

    const handleFileSave = () => {
        dispatch(openNotePadFileActionModal(true));
        setShow(false)
        openSaveFileModal({
            appName: AppsT.NotePad,
            onSuccess: async (e) => {
                console.log(e);
                // dispatch(openNotePad(e as FileT))
                // getTextFileContent(e.id)
                //     .unwrap()
                //     .then((content) => {
                //         dispatch(setNotePadContent(content))
                //     })
                //     .catch((error) => {
                //         console.error("Failed to fetch file content:", error);
                //         showToast("Error fetching file content", "error");
                //     });
            },
            onClose: () => {
                dispatch(openNotePadFileActionModal(false));
            }
        })
    }

    return (
        <div className=" relative">
            <Button size={'small'} className="" onClick={() => setShow(true)}>
                File
            </Button>
            {show && (
                <MainDropDownMenu ref={ref} className=" right-2/4 translate-x-2/4">
                    <Button size={'menu'} onClick={handleFileOpen} className=" ">
                        Open File
                    </Button>
                    <MainMenuSeparator />
                    <Button size={'menu'} onClick={handleFileSave} className=" ">
                        Save
                    </Button>
                    <Button size={'menu'} className=" ">
                        Save As
                    </Button>
                    <MainMenuSeparator />
                    <Button size={'menu'} className=" ">
                        Exit
                    </Button>
                    {/* <SubDropDownMenu name="Date" position="left">
                        <Button size={'menu'} className=" ">
                            Date
                        </Button>
                    </SubDropDownMenu> */}
                </MainDropDownMenu>
            )}
        </div>
    )
}

export default NotePadOptions