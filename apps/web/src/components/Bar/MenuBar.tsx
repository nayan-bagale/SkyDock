import { Bar, Button } from "@repo/ui";
import { Icons } from "@repo/ui/icons";
import { useDate } from "../hooks/useDate";

const MenuBar = () => {
  const date = useDate();

  return (
    <Bar className=" flex justify-between items-center">
      <div></div>
      <div className=" w-full flex items-center justify-between">
        <div className=" flex justify-evenly items-center gap-3 px-3">
          <Button className=" p-0 hover:bg-transparent hover:drop-shadow-[0px_0px_5px_#ffffff]">
            <Icons.Logo className=" h-7" />
          </Button>
          <div className=" flex items-center gap-4">
            <div className=" text-xs font-semibold cursor-default ">
              Terminal
            </div>
            <Button size={'small'} className=" drop-shadow" style={{ textShadow: '0px 2px 2px rgba(255, 255, 255, 0.4)' }} >
              File
            </Button>
          </div>
        </div>
        <div className=" flex justify-evenly items-center gap-2 px-2">
          <Button>
            <Icons.Control_Center className="h-4" />
          </Button>
          <Button size={'small'} className="">
            {date}
          </Button>
        </div>
      </div>
    </Bar>
  )
}

export default MenuBar