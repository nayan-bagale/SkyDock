import { Button } from "@/ui/button"
import { AuthCard } from "@/ui/Cards/AuthFlow/AuthCard"
import { Form } from "@/ui/Cards/AuthFlow/Form"
import { Input } from "@/ui/input"
import cn from "@/utils"
import sleep from "@/utils/sleep"
import { Icons } from "@repo/ui/icons"
import { emailValidation, passwordValidation } from "@repo/validation"
import { FC, useState } from "react"
import ErrorMessage from "./ErrorMessage"

interface SignupProps {
    windowChange: (window: 'signin' | 'signup') => void;
}

const Signup: FC<SignupProps> = ({ windowChange }) => {
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit: any = async (e: any) => {
        e.preventDefault()
        const fname = e.target[0].value;
        const lname = e.target[1].value;
        const email = e.target[2].value;
        if (!emailValidation(email).valid) {
            console.log('Invalid email')
            setEmailError(emailValidation(email).message);
            return;
        }
        setEmailError('')


        const password = e.target[3].value;
        if (!passwordValidation(password).valid) {
            setPasswordError(passwordValidation(password).message);
            return;
        }
        setPasswordError('')

        const confirmPassword = e.target[4].value;
        if (!passwordValidation(confirmPassword).valid) {
            setConfirmPasswordError(passwordValidation(confirmPassword).message);
            return;
        }
        setConfirmPasswordError('')
        if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            return;
        }
        setConfirmPasswordError('')
        setSubmitting(true)
        await sleep(2000);
        setSubmitting(false)
        console.log(fname, lname, email, password, confirmPassword)
        e.target.reset()
    }

    return (
        <AuthCard>
            <h1 className=" text-2xl font-bold text-white mb-1 ">Register</h1>
            <Form onSubmit={handleSubmit}>
                <div className=" flex gap-2">
                    <div className=" flex flex-col  gap-2">
                        <label htmlFor="name">First Name </label>
                        <Input className="" id="name" placeholder="First Name" />
                    </div>
                    <div className=" flex flex-col  gap-2">
                        <label htmlFor="lname">Last Name </label>
                        <Input className="" id="lname" placeholder="Last Name" />
                    </div>
                </div>

                <label htmlFor="email" className=" self-start">Email </label>
                <Input className={cn(emailError && 'border-red-500')} id="email" placeholder="name@company.com" type="email" />
                {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
                <label htmlFor="password" className=" self-start">Password </label>
                <Input className="" id="password" placeholder="Password" />
                {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
                <label htmlFor="confirm-password" className=" self-start">Confirm Password </label>
                <Input className="" id="confirm-password" placeholder="Confirm Password" type="password" />
                {confirmPasswordError && <ErrorMessage>{confirmPasswordError}</ErrorMessage>}

                <Button size={'medium'} className=" my-2 w-full flex items-center justify-center  " disabled={submitting} intent={'secondary'} type="submit">
                    {submitting ? <span className=" animate-spin"><Icons.Loader className=" h-6 w-6" /> </span> : "Register"}

                </Button>
            </Form>
            {/* <div className="w-[95%] border-b border-gray-200"></div> */}
            <div className=" flex items-center gap-2">
                <p className=" text-white text-sm">Already have an account? </p>
                <Button className=" hover:bg-transparent text-white text-sm " disabled={submitting} onClick={() => windowChange('signin')}>
                    Login
                </Button>
            </div>

        </AuthCard>
    )
}

export default Signup

