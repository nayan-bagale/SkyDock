import { useState } from "react"
import ForgotPassword from "./ForgotPassword/ForgotPassword"
import Signin from "./Signin"
import Signup from "./Signup"

const Auth = () => {
    const [window, setWindow] = useState<'signup' | 'signin' | 'forgot'>('signin')
    return (
        <>
            {/* <div className="absolute top-0">
                <img src="skydock-logo-resized.png" className=" h-32 w-32" alt="" />
            </div> */}
            {window === 'signin' && <Signin windowChange={setWindow} />}
            {window === 'signup' && <Signup windowChange={setWindow} />}
            {window === 'forgot' && <ForgotPassword windowChange={setWindow} />}
        </>
    )
}

export default Auth