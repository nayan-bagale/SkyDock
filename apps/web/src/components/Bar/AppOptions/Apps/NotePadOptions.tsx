import { FileSaveAndOpenModalContext } from "@/components/ContextApi/FileSaveAndOpenModal";
import useOnClickOutside from "@/components/hooks/useOnclickOutside";
import { openNotePad, openNotePadFileActionModal } from "@/redux/features/note-pad/notePadSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Button } from "@/ui/button";
import { MainDropDownMenu, MainMenuSeparator } from "@/ui/Cards/Menus/MainDropDownMenu/MainDropDownMenu";
import { FileT } from "@skydock/types";
import { AppsT } from "@skydock/types/enums";
import { useContext, useRef, useState } from "react";

const NotePadOptions = () => {
    const [show, setShow] = useState(false);
    const ref = useRef<HTMLDivElement>(null)
    useOnClickOutside(ref, () => setShow(false));
    const dispatch = useAppDispatch();

    const { openFileOpenerModal } = useContext(FileSaveAndOpenModalContext);

    const handleFileOpen = () => {
        dispatch(openNotePadFileActionModal(true));
        setShow(false)
        openFileOpenerModal({
            app: AppsT.NotePad,
            onSuccess: (e) => {

                dispatch(openNotePad(e as FileT))
                console.log(e)
            },
            onClose: () => {
                // dispatch(openNotePadFileActionModal(false));
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
                    <Button size={'menu'} className=" ">
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