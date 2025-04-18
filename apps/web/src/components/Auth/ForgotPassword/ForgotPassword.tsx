import { useCountdownTimer } from "@/components/hooks/useCountdownTimer"
import { REGEXP_ONLY_DIGITS } from "@/constants"
import { useResetPasswordMutation, useSendOtpMutation, useVerifyOtpMutation } from "@/redux/apis/userAuthApi"
import { Button } from "@/ui/button"
import { AuthCard } from "@/ui/Cards/AuthFlow/AuthCard"
import { Form } from "@/ui/Cards/AuthFlow/Form"
import { Input } from "@/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@skydock/ui/input-otp"
import { showToast } from "@skydock/ui/toast"
import { emailValidation, passwordValidation } from "@skydock/validation"
import { FC, memo, useReducer, useState } from "react"
import ErrorMessage from "../ErrorMessage"
import { ActionTypes, forgotPasswordReducer, initialState } from "./reducer"


interface SigninProps {
    windowChange: (window: 'signin' | 'signup' | 'forgot') => void;
}



const ForgotPassword: FC<SigninProps> = ({ windowChange }) => {

    const [state, dispatch] = useReducer(forgotPasswordReducer, initialState);
    const [step, setStep] = useState(0);

    const [sendOtp, { isLoading: isSendOtpLoading }] = useSendOtpMutation();
    const [verifyOtp, { isLoading: isVerifyOtpLoading }] = useVerifyOtpMutation();
    const [resetPassword, { isLoading: isResetPasswordLoading }] = useResetPasswordMutation();

    const resendOtp = async () => {
        try {
            await sendOtp(state.email.value).unwrap()
            showToast(
                'OTP resend to your email',
                'success'
            )
        } catch (e: any) {
            showToast(
                e?.data?.message || 'Something went wrong',
                'error'
            )
            throw e;
        }
    }

    const handleSubmit: any = async (e: any) => {
        e.preventDefault()

        dispatch({
            type: ActionTypes.RESET_ERRORS,
            payload: ''
        })

        switch (step) {
            case 0: {
                const email = emailValidation(e.target[0].value)
                if (!email.valid) {
                    dispatch({ type: ActionTypes.SET_EMAIL_ERROR, payload: email.message })
                    return;
                }
                try {
                    await sendOtp(e.target[0].value).unwrap()
                    dispatch({ type: ActionTypes.SET_EMAIL, payload: e.target[0].value })
                    setStep(prev => prev + 1)
                    showToast(
                        'OTP sent to your email',
                        'success'
                    )

                } catch (e: any) {
                    showToast(
                        e?.data?.message || 'Something went wrong',
                        'error'
                    )
                }
                break;
            } case 1: {
                const otp = e.target[0].value
                if (otp.length < 6) {
                    dispatch({ type: ActionTypes.SET_OTP_ERROR, payload: 'OTP must be 6 digits' })
                    return;
                }
                try {
                    await verifyOtp({ email: state.email.value, otp }).unwrap()
                    dispatch({ type: ActionTypes.SET_OTP, payload: otp })
                    showToast(
                        'OTP successfully verified',
                        'success'
                    )
                    setStep(prev => prev + 1)
                } catch (e: any) {
                    showToast(
                        e?.data?.message || 'Something went wrong',
                        'error'
                    )
                    return;
                }

                break;
            } case 2: {
                const passwordInfo = passwordValidation(e.target[0].value)
                if (!passwordInfo.valid) {
                    dispatch({ type: ActionTypes.SET_PASSWORD_ERROR, payload: passwordInfo.message })
                    return;
                }
                const confirmPasswordInfo = passwordValidation(e.target[1].value)
                if (!confirmPasswordInfo.valid) {
                    dispatch({ type: ActionTypes.SET_CONFIRM_PASSWORD_ERROR, payload: confirmPasswordInfo.message })
                    return;
                }
                if (e.target[0].value !== e.target[1].value) {
                    dispatch({ type: ActionTypes.SET_CONFIRM_PASSWORD_ERROR, payload: 'Passwords do not match' })
                    return;
                }
                try {
                    await resetPassword({ email: state.email.value, password: e.target[0].value }).unwrap()
                    dispatch({ type: ActionTypes.SET_CONFIRM_PASSWORD, payload: e.target[1].value })
                    dispatch({ type: ActionTypes.SET_PASSWORD, payload: e.target[0].value })
                    showToast(
                        'Password successfully changed',
                        'success'
                    )
                    windowChange('signin');
                } catch (e: any) {
                    showToast(
                        e?.data?.message || 'Something went wrong',
                        'error'
                    )
                    return;
                }
                break;
            }
        }
    }



    return (
        <AuthCard>
            <h1 className=" text-2xl font-bold text-white ">Forgot Password</h1>
            <Form className="mt-4" onSubmit={handleSubmit}>
                {
                    step === 0 && <Email_Component errorMessage={state.email.error} />
                }
                {
                    step === 1 && <OTP_Component errorMessage={state.otp.error} resendOtp={resendOtp} />
                }
                {
                    step === 2 && <NewPassword_Component passwordError={state.password.error} confirmPasswordError={state.confirmPassword.error} />
                }
                <div className=" flex items-center gap-2 w-full justify-center">
                    <p>Want to login? </p>
                    <Button className=" hover:bg-transparent text-white " onClick={() => windowChange('signin')}>Login</Button>
                </div>
            </Form>

        </AuthCard>
    )
}

const Email_Component = memo(({ errorMessage }: { errorMessage: string }) => {
    return (
        <>
            <label className=" self-start" htmlFor="">Enter Email</label>
            <Input placeholder="name@company.com" type='email' />
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            <Button size={'medium'} className=" w-full flex items-center justify-center my-2 " intent={'secondary'} type="submit">Send OTP</Button>
        </>
    )
})
const OTP_Component = memo(({ errorMessage, resendOtp }: { errorMessage: string, resendOtp: any }) => {
    const { isExpired, startTimer, timer } = useCountdownTimer();

    const handleResendOtp = () => {
        resendOtp().then(() => {
            startTimer();
        })
    }
    return (
        <div>
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
            <div className=" mt-2 text-sm flex items-center gap-2 w-full justify-center">
                {isExpired ? <>
                    <p>Didn't receive OTP? </p>
                    <Button className=" hover:bg-transparent text-white " onClick={handleResendOtp}>Resend OTP</Button>
                </> : <p>Resend OTP in {timer}</p>}
            </div>
            <Button size={'medium'} className=" w-full flex items-center justify-center my-2 " intent={'secondary'} type="submit">Verify OTP</Button>
        </div>
    )
})

const NewPassword_Component = memo(({ confirmPasswordError, passwordError }: { confirmPasswordError: string, passwordError: string }) => {
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
})


export default ForgotPassword

