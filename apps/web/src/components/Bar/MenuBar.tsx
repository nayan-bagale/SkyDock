import { Bar, Button } from "@repo/ui";
import { Icons } from "@repo/ui/icons";
import Date_n_Time from "./DatenTime/Date_n_Time";
import Logo from "./Logo/Logo";

const MenuBar = () => {

  return (
    <>
      <Bar className=" flex justify-between items-center">
        <div></div>
        <div className=" w-full flex items-center justify-between">
          <div className=" flex justify-evenly items-center gap-3 px-3">
            <Logo />
            <div className=" flex items-center gap-4">
              <div className=" text-xs font-semibold cursor-default ">
                Terminal
              </div>
              <Button size={'small'} className=" drop-shadow">
                File
              </Button>
            </div>
          </div>
          <div className=" flex justify-evenly items-center gap-2 px-2">
            <Button>
              <Icons.Control_Center className="h-4" />
            </Button>
            <Date_n_Time />
          </div>
        </div>
      </Bar>
    </>
  )
}

export default MenuBar