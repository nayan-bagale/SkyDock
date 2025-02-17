import { useAppSelector } from "@/redux/hooks";
import { Button } from "@/ui/button";
import ControlCenter from "@/ui/Cards/ControlCenter/ControlCenter";
import { Bar } from "@/ui/MenuBar/Bar";
import Date_n_Time from "./DatenTime/Date_n_Time";
import FullScreenBtn from "./FullScreenBtn/FullScreenBtn";
import Logo from "./Logo/Logo";
import ProfileDropdown from "./Profile/ProfleDropDown";

const MenuBar = () => {
  const focusedAppName = useAppSelector((state) => state.apps.focusedApp);
  return (
    <>
      <Bar className=" flex justify-between items-center">
        <div></div>
        <div className=" w-full flex items-center justify-between">
          <div className=" flex justify-evenly items-center gap-3 px-3">
            <Logo />
            <div className=" flex items-center gap-4">
              <div className=" text-xs font-semibold cursor-default ">
                {focusedAppName}
              </div>
              <Button size={'small'} className=" drop-shadow">
                File
              </Button>
            </div>
          </div>
          <div className=" flex justify-evenly items-center gap-2 px-2">
            <FullScreenBtn />
            <ControlCenter />
            <Date_n_Time />
            <ProfileDropdown />
          </div>
        </div>
      </Bar>
    </>
  )
}

export default MenuBar