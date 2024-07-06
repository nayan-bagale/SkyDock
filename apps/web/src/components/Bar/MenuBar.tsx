import { Bar, Button } from "@repo/ui"
import { Icons } from "@repo/ui/icons"
import { useDate } from "../hooks/useDate"

const MenuBar = () => {
  const date = useDate();
  console.log(date)

  return (
    <Bar className=" flex justify-between items-center">
      <div></div>
      <div className=" flex items-center justify-evenly">
        <div></div>
        <div className=" flex justify-evenly items-center gap-2 px-2">

          <Button>
            <Icons.Control_Center className=" h-4" />
          </Button>
          <Button size={'small'} className="text-xs">
            {date}
          </Button>
        </div>
      </div>
    </Bar>
  )
}

export default MenuBar