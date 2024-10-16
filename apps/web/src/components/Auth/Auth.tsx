import { useState } from "react"
import Signin from "./Signin"
import Signup from "./Signup"

const Auth = () => {
    const [window, setWindow] = useState<'signup' | 'signin'>('signin')
    return (
        <>
            {window === 'signin' && <Signin windowChange={setWindow} />}
            {window === 'signup' && <Signup windowChange={setWindow} />}
        </>
    )
}

export default Auth