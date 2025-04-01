import useOutsideAlerter from "@/components/hooks/useOnclickOutside";
import { Button } from "@/ui/button";
// import { MainDropDownMenu, SubDropDownMenu } from "@/ui/Cards/Menus/MainDropDownMenu/MainDropDownMenu";
import { useRef, useState } from "react";
import { useDate } from "../../hooks/useDate";


const Date_n_Time = () => {
    const [show, setShow] = useState(false);
    const ref = useRef<HTMLDivElement>(null)
    const date = useDate();

    const toggleDropdown = () => {
        setShow(!show);
    };

    useOutsideAlerter(ref, () => setShow(false));

    return (
        <div className=" relative">
            <Button size={'small'} className="" onClick={() => setShow(true)}>
                {date}
            </Button>
            {/* {show && (
                <MainDropDownMenu ref={ref} className=" right-0">
                    <div className=" flex flex-col gap-2">
                        <div className=" text-xs font-semibold cursor-default ">
                            Date and Time
                        </div>
                        <div className=" text-xs font-semibold cursor-default ">
                            12:00 PM
                        </div>
                    </div>
                    <Button size={'menu'} className=" ">
                        Settings
                    </Button>
                    <SubDropDownMenu name="Date" position="right">
                        <Button size={'menu'} className=" ">
                            Date
                        </Button>
                    </SubDropDownMenu>
                </MainDropDownMenu>
            )} */}
        </div>

    )
}

export default Date_n_Time