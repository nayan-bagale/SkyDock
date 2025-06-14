// import { process } from "@/redux/features/apps/app/terminalSlice"
// import { useAppDispatch } from "@/redux/hooks"
import useAppProcess from "@/components/hooks/useAppProcess"
import useOutsideAlerter from "@/components/hooks/useOnclickOutside"
import { Button } from "@/ui/button"
import { MainDropDownMenu, SubDropDownMenu } from "@/ui/Cards/Menus/MainDropDownMenu/MainDropDownMenu"
import { Icons } from "@skydock/ui/icons"
import { showToast } from "@skydock/ui/toast"
import { useRef, useState } from "react"

function dummyPromise(delay: number, shouldReject = false) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldReject) {
                reject(`Promise rejected after ${delay}ms`);
            } else {
                resolve(`Promise resolved after ${delay}ms`);
            }
        }, delay);
    });
}

const Logo = () => {
    const [show, setShow] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    // const dispatch = useAppDispatch();

    useOutsideAlerter(ref, () => setShow(false));

    const { musicPlayerApp, imageViewerApp } = useAppProcess();

    const handleToast = () => {
        // showToast('This is a toast message', 'success')
        showToast('This is a toast message', 'success')
    }


    return (
        <>
            <Button className="hover:bg-transparent transition hover:drop-shadow-[0px_0px_5px_#ffffff] p-0"
            // onClick={() => setShow(true)}
            >
                <Icons.Logo className="h-7" />
            </Button>
            {show && (
                <MainDropDownMenu ref={ref} className="left-3">

                    {/* <Button size={'menu'}>
                        About CatOs
                    </Button>
                    <MainMenuSeparator /> */}
                    {/* <Button onClick={handleToast} size={'menu'}>
                        Show Toast
                    </Button> */}
                    <SubDropDownMenu name="Apps" >
                        <Button size={'menu'} onClick={imageViewerApp.open}>
                            Image Viewer
                        </Button>
                        <Button size={'menu'} onClick={musicPlayerApp.open}>
                            Music Player
                        </Button>
                        {/* <MainMenuSeparator />
                        <Button size={'menu'}>
                            System Preference..
                        </Button> */}
                    </SubDropDownMenu>
                    {/* <MainMenuSeparator />
                    <Button size={'menu'}>
                        System Preference..
                    </Button> */}
                    {/* <Button onClick={signOut} className="hover:bg-red-600" size={'menu'}>
                        LogOut
                    </Button> */}
                </MainDropDownMenu>
            )}

        </>
    )
}

export default Logo