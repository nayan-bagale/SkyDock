import useOutsideAlerter from "@/components/hooks/useOnclickOutside"
// import { process } from "@/redux/features/apps/app/terminalSlice"
// import { useAppDispatch } from "@/redux/hooks"
import { Button } from "@/ui/button"
import { MainDropDownMenu, MainMenuSeparator, SubDropDownMenu } from "@/ui/Cards/Menus/MainDropDownMenu/MainDropDownMenu"

import { Icons } from "@skydock/ui/icons"
import { useRef, useState } from "react"

const Logo = () => {
    const [show, setShow] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    // const dispatch = useAppDispatch();

    useOutsideAlerter(ref, () => setShow(false));

    const apps = {
        // terminal: () => (dispatch(process('on')), setShow(false)),
    }



    return (
        <>
            <Button className="hover:bg-transparent hover:drop-shadow-[0px_0px_5px_#ffffff] p-0"
                onClick={() => setShow(true)}
            >
                <Icons.Logo className="h-7" />
            </Button>
            {show && (
                <MainDropDownMenu ref={ref} className="left-3">
                    <Button size={'menu'}>
                        About CatOs
                    </Button>
                    <MainMenuSeparator />
                    <Button size={'menu'}>
                        MainDropDownMenu
                    </Button>
                    <SubDropDownMenu name="Recent.." >
                        <Button size={'menu'}>
                            Terminal
                        </Button>
                        <MainMenuSeparator />
                        <Button size={'menu'}>
                            System Preference..
                        </Button>
                    </SubDropDownMenu>
                    <MainMenuSeparator />
                    <Button size={'menu'}>
                        System Preference..
                    </Button>
                    {/* <Button onClick={signOut} className="hover:bg-red-600" size={'menu'}>
                        LogOut
                    </Button> */}
                </MainDropDownMenu>
            )}

        </>
    )
}

export default Logo