import { useLoginMutation, useProtectedMutation } from "@/redux/APISlice"
import { setCredentials } from "@/redux/features/auth"
import { useAppDispatch } from "@/redux/hooks"
import { Button } from "@/ui/button"
import { AuthCard } from "@/ui/Cards/AuthFlow/AuthCard"
import { Form } from "@/ui/Cards/AuthFlow/Form"
import { Input, InputPassword } from "@/ui/input"
import { emailValidation, passwordValidation } from "@repo/validation"
import { FC, useState } from "react"
import ErrorMessage from "./ErrorMessage"

interface SigninProps {
    windowChange: (window: 'signin' | 'signup') => void;
}

const Signin: FC<SigninProps> = ({ windowChange }) => {

    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [login, { isLoading }] = useLoginMutation();
    const [protectedD] = useProtectedMutation();
    const dispatch = useAppDispatch()


    const handleSubmit = async (e: any): void => {
        e.preventDefault()

        const email = emailValidation(e.target[0].value)
        if (!email.valid) {
            setEmailError(email.message)
            return;
        }
        setEmailError('')

        const password = passwordValidation(e.target[1].value)
        if (!password.valid) {
            setPasswordError(password.message)
            return;
        }
        setPasswordError('')

        const rememberMe = e.target[3].checked;


        console.log({ email: e.target[0].value, password: e.target[1].value })
        try {
            const data = await login({ username: e.target[0].value, password: e.target[1].value }).unwrap()
            dispatch(setCredentials(data))
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleProteced = async () => {
        try {
            const data = await protectedD({}).unwrap()
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <AuthCard>
            <h1 className=" text-2xl font-bold text-white ">Login</h1>
            <Form onSubmit={handleSubmit}>
                <label className=" self-start" htmlFor="">Email</label>
                <Input placeholder="name@company.com" type='email' />
                {emailError && <ErrorMessage>{emailError}</ErrorMessage>}

                <label className=" self-start" htmlFor="">Password</label>
                <InputPassword placeholder="Password" />
                {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
                <div className=" flex items-center justify-between w-full">
                    <div>
                        <input id="remember-me" type="checkbox" />
                        <label htmlFor="remember-me"> Remember Me</label>
                    </div>
                    <Button className="hover:bg-transparent text-white">Forgot Password</Button>
                </div>
                <Button size={'medium'} className=" w-full flex items-center justify-center my-2 " intent={'secondary'} type="submit">Login</Button>
                <div className=" flex items-center gap-2 w-full justify-center">
                    <p>Don't have account? </p>
                    <Button className=" hover:bg-transparent text-white " onClick={() => windowChange('signup')}>Register</Button>
                </div>
                <Button size={'medium'} onClick={handleProteced} className=" w-full flex items-center justify-center my-2 " intent={'primary'}>Protected</Button>
            </Form>

        </AuthCard>
    )
}


export default Signin

