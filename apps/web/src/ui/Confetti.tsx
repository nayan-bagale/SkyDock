import Confetti from "@skydock/ui/confetti"
import { useWindowSize } from "react-use"

const Confetti_ = () => {
    const { width, height } = useWindowSize()
    return (
        <Confetti width={width} height={height} />
    )
}

export default Confetti_