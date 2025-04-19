
import Confetti from 'react-confetti'

export default ({ width, height, run }: any) => {

    return (
        <Confetti
            width={width}
            height={height}
            run={run}
            numberOfPieces={200}
        />
    )
}