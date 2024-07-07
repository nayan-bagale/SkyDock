import { useAppSelector } from "@/redux/hooks";
import Terminal from "./terminal/Terminal";

const Apps_ = () => {
    const terminal = useAppSelector((state: any) => state.terminal.process);

    return (<>
        {terminal === 'on' && <Terminal />}
    </>
    )
}

export default Apps_