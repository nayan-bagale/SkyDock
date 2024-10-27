import useFullScreen from "@/components/hooks/useFullScreen";
import { Button } from "@/ui/button";
import { Icons } from "@repo/ui/icons";

const FullScreenBtn = () => {
  const [isFullScreen, toggleFullScreen] = useFullScreen();
  return (
    <Button className="p-1" onClick={toggleFullScreen}>
      {isFullScreen ? (
        <Icons.Full_Screen_Exit className="h-3" />
      ) : (
        <Icons.Full_Screen className="h-3" />
      )}
    </Button >)
}

export default FullScreenBtn