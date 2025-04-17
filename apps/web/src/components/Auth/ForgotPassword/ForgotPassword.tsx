import { REGEXP_ONLY_DIGITS } from "@/constants"
import { Button } from "@/ui/button"
import { AuthCard } from "@/ui/Cards/AuthFlow/AuthCard"
import { Form } from "@/ui/Cards/AuthFlow/Form"
import { Input } from "@/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@skydock/ui/input-otp"
import { showToast } from "@skydock/ui/toast"
import { emailValidation, passwordValidation } from "@skydock/validation"
import { FC, useState } from "react"
import ErrorMessage from "../ErrorMessage"


interface SigninProps {
    windowChange: (window: 'signin' | 'signup' | 'forgot') => void;
}

const ForgotPassword: FC<SigninProps> = ({ windowChange }) => {

    const [emailError, setEmailError] = useState('')
    const [otpError, setOtpError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')
    const [step, setStep] = useState(0);


    const handleSubmit: any = (e: any) => {
        e.preventDefault()
        setEmailError('')
        setOtpError('')
        setPasswordError('')
        setConfirmPasswordError('')

        switch (step) {
            case 0: {
                const email = emailValidation(e.target[0].value)
                if (!email.valid) {
                    setEmailError(email.message)
                    return;
                }
                setStep(prev => prev + 1)
                showToast(
                    'OTP sent to your email',
                    'success'
                )
                break;
            } case 1: {
                const otp = e.target[0].value
                if (otp.length < 6) {
                    setOtpError('OTP must be 6 digits')
                    return;
                }
                console.log(otp)
                showToast(
                    'OTP successfully verified',
                    'success'
                )
                setStep(prev => prev + 1)
                break;
            } case 2: {
                const passwordInfo = passwordValidation(e.target[0].value)
                if (!passwordInfo.valid) {
                    setPasswordError(passwordInfo.message)
                    return;
                }
                const confirmPasswordInfo = passwordValidation(e.target[1].value)
                if (!confirmPasswordInfo.valid) {
                    setConfirmPasswordError(confirmPasswordInfo.message)
                    return;
                }
                if (e.target[0].value !== e.target[1].value) {
                    setConfirmPasswordError('Passwords do not match')
                    return;
                }
                showToast(
                    'Password successfully changed',
                    'success'
                )
                windowChange('signin');
                console.log(e.target[0].value, e.target[1].value)
                break;
            }
        }
    }



    return (
        <AuthCard>
            <h1 className=" text-2xl font-bold text-white ">Forgot Password</h1>
            <Form className="mt-4" onSubmit={handleSubmit}>
                {step === 0 && (
                    <>
                        <label className=" self-start" htmlFor="">Enter Email</label>
                        <Input placeholder="name@company.com" type='email' />
                        {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
                        <Button size={'medium'} className=" w-full flex items-center justify-center my-2 " intent={'secondary'} type="submit">Send OTP</Button>

                    </>
                )}
                {(
                    step === 1 && <OTP_Component errorMessage={otpError} />
                )}
                {(
                    step === 2 && <NewPassword_Component passwordError={passwordError} confirmPasswordError={confirmPasswordError} />
                )}
                <div className=" flex items-center gap-2 w-full justify-center">
                    <p>Want to login? </p>
                    <Button className=" hover:bg-transparent text-white " onClick={() => windowChange('signin')}>Login</Button>
                </div>
            </Form>

        </AuthCard>
    )
}

const OTP_Component = ({ errorMessage }: { errorMessage: string }) => {

    return (
        <div className=" flex flex-col gap-2">
            <label className=" self-start" htmlFor="">Enter OTP</label>
            <div className="space-y-2">
                <InputOTP
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS}
                >
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
            </div>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            <Button size={'medium'} className=" w-full flex items-center justify-center my-2 " intent={'secondary'} type="submit">Verify OTP</Button>
        </div>
    )
}

const NewPassword_Component = ({ confirmPasswordError, passwordError }: { confirmPasswordError: string, passwordError: string }) => {
    return (
        <>
            <label htmlFor="password" className=" self-start">Password </label>
            <Input className="" id="password" placeholder="Password" />
            {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}

            <label htmlFor="confirm-password" className=" self-start">Confirm Password </label>
            <Input className="" id="confirm-password" placeholder="Confirm Password" type="password" />
            {confirmPasswordError && <ErrorMessage>{confirmPasswordError}</ErrorMessage>}
            <Button size={'medium'} className=" w-full flex items-center justify-center my-2 " intent={'secondary'} type="submit">Save password</Button>

        </>
    )
}


export default ForgotPassword

