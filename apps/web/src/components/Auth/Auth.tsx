// import { useAppSelector } from "@/redux/hooks"
// import { AnimatePresence } from "framer-motion"
// import { useState } from "react"
// import { Navigate } from "react-router"
// import ForgotPassword from "./ForgotPassword/ForgotPassword"
// import Signin from "./Signin"
// import Signup from "./Signup"

// const Auth = () => {
//     const [window, setWindow] = useState<'signup' | 'signin' | 'forgot'>('signin')
//     const user = useAppSelector((state) => state.auth.user)
//     if (user) {
//         return <Navigate to="/skydock" replace />
//     }

//     return (
//         <>
//             {/* <div className="absolute top-0">
//                 <img src="skydock-logo-resized.png" className=" h-32 w-32" alt="" />
//             </div> */}
//             <AnimatePresence>
//                 {window === 'signin' && <Signin />}
//                 {window === 'signup' && <Signup />}
//                 {window === 'forgot' && <ForgotPassword />}
//             </AnimatePresence>
//         </>
//     )
// }

// export default Auth