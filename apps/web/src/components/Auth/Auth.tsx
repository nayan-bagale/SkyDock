import { useAppSelector } from "@/redux/hooks"
import { AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Navigate } from "react-router"
import ForgotPassword from "./ForgotPassword/ForgotPassword"
import Signin from "./Signin"
import Signup from "./Signup"

const Auth = () => {
    const [window, setWindow] = useState<'signup' | 'signin' | 'forgot'>('signin')
    const token = useAppSelector((state) => state.auth.accessToken)

    if (token) {
        return <Navigate to="/skydock" replace />
    }

    return (
        <>
            {/* <div className="absolute top-0">
                <img src="skydock-logo-resized.png" className=" h-32 w-32" alt="" />
            </div> */}
            <AnimatePresence>
                {window === 'signin' && <Signin windowChange={setWindow} />}
                {window === 'signup' && <Signup windowChange={setWindow} />}
                {window === 'forgot' && <ForgotPassword windowChange={setWindow} />}
            </AnimatePresence>
        </>
    )
}

export default Auth