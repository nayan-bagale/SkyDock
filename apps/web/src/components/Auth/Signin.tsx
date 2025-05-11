import { useGoogleLoginMutation, useLoginMutation, useSendEmailVerificationMutation } from "@/redux/apis/userAuthApi"
import { setAccessToken } from "@/redux/features/auth"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { Button } from "@/ui/button"
import { AuthCard } from "@/ui/Cards/AuthFlow/AuthCard"
import { Form } from "@/ui/Cards/AuthFlow/Form"
import { Input, InputPassword } from "@/ui/input"
import { Icons } from "@skydock/ui/icons"
import { showToast } from "@skydock/ui/toast"
import { emailValidation, passwordValidation } from "@skydock/validation"
import { FC, useState } from "react"
import { Navigate, useNavigate } from "react-router"
import useServerErrors from "../hooks/useServerErrors"
import ErrorMessage from "./ErrorMessage"
import InfoMessage from "./InfoMessage"

interface SigninProps {
}

const Signin: FC<SigninProps> = () => {



    const [formError, setFormError] = useState({
        email: '',
        password: ''
    })

    const [serverError, setServerError] = useServerErrors();
    const [emailVerification, setEmailVerification] = useState(false);
    const [email, setEmail] = useState('')

    const navigate = useNavigate()


    const [login, { isLoading: isLoginLoading }] = useLoginMutation();
    const [sendEmailVerification, { isLoading: isSendEmailVerificationLoading }] = useSendEmailVerificationMutation();

    const [loginWithGoogle] = useGoogleLoginMutation()

    const isLoading = isLoginLoading || isSendEmailVerificationLoading;
    const dispatch = useAppDispatch()

    const user = useAppSelector((state) => state.auth.user)
    if (user) {
        return <Navigate to="/" replace />
    }

    const handleLoginWithGoogle = async () => {
        try {
            // const data = await loginWithGoogle('').unwrap()

            window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
        } catch (e: any) {
            showToast(
                e.data.message,
                'error'
            )
        }
    }

    const handleEmailVerification = async () => {
        try {
            await sendEmailVerification(email).unwrap()
            showToast(
                'Verification email sent',
                'success'
            )
        } catch (e: any) {
            showToast(
                e.data.message,
                'error'
            )
        } finally {
            setEmailVerification(false)
            setServerError('')
        }
    }


    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setServerError('')

        const email = emailValidation(e.target[0].value)
        if (!email.valid) {
            setFormError({ ...formError, email: email.message })
            return;
        }
        setFormError({ ...formError, email: '' })

        const password = passwordValidation(e.target[1].value)
        if (!password.valid) {
            setFormError({ ...formError, password: password.message })
            return;
        }
        setFormError({ ...formError, password: '' })


        try {
            const data = await login({ email: e.target[0].value, password: e.target[1].value }).unwrap()
            dispatch(setAccessToken(data.accessToken))
            e.target.reset()
        } catch (e: any) {

            if (e.data.verifyEmail) {
                setEmailVerification(true)
            } else {
                showToast(
                    e.data.message,
                    'error'
                )
                setServerError(e.data.message)
                setEmailVerification(false)
            }
        }
    }

    return (
        <AuthCard>
            <h1 className=" text-2xl font-bold text-white ">Login</h1>
            {serverError && <ErrorMessage>{serverError}</ErrorMessage>}
            {emailVerification && <InfoMessage className=" inline-flex justify-between"> Click to resend verification email
                <a href="#" onClick={(e) => {
                    e.preventDefault();
                    handleEmailVerification()
                }}>Resend</a>
            </InfoMessage>}
            <Form onSubmit={handleSubmit}>
                <label className=" self-start" htmlFor="">Email</label>
                <Input onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" type='email' />
                {formError.email && <ErrorMessage>{formError.email}</ErrorMessage>}

                <label className=" self-start" htmlFor="">Password</label>
                <InputPassword placeholder="Password" />
                {formError.password && <ErrorMessage>{formError.password}</ErrorMessage>}
                <div className=" flex items-center justify-between w-full">
                    <div>
                        {/* <input id="remember-me" type="checkbox" />
                        <label htmlFor="remember-me"> Remember Me</label> */}
                    </div>
                    <Button className="hover:bg-transparent text-white" disabled={isLoading} onClick={() => navigate('/forgot-password')} >Forgot Password</Button>
                </div>
                <Button size={'medium'} className=" w-full flex items-center justify-center my-2 " disabled={isLoading} intent={'secondary'} type="submit">
                    {isLoading ? <span className=" animate-spin"><Icons.Loader className=" h-6 w-6" /> </span> : "Login"}
                </Button>
                <div className=" flex items-center gap-2 w-full justify-center">
                    <p>Don't have account? </p>
                    <Button className=" hover:bg-transparent text-white " disabled={isLoading} onClick={() => navigate('/register')}>Register</Button>
                </div>
                <Button size={'medium'} onClick={handleLoginWithGoogle} className=" w-full flex items-center justify-center my-2 " intent={'secondary'}>
                    Sign in with Google
                </Button>
            </Form>
        </AuthCard>
    )
}


export default Signin

