import { useRegisterMutation } from "@/redux/apis/userAuthApi"
import { useAppSelector } from "@/redux/hooks"
import { Button } from "@/ui/button"
import { AuthCard } from "@/ui/Cards/AuthFlow/AuthCard"
import { Form } from "@/ui/Cards/AuthFlow/Form"
import { Input } from "@/ui/input"
import cn from "@/utils"
import { Icons } from "@skydock/ui/icons"
import { emailValidation, passwordValidation } from "@skydock/validation"
import { FC, useState } from "react"
import { Navigate, useNavigate } from "react-router"
import useServerErrors from "../hooks/useServerErrors"
import ErrorMessage from "./ErrorMessage"

interface SignupProps {
}

const Signup: FC<SignupProps> = () => {

    const [formError, setFormError] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [serverError, setServerError] = useServerErrors()

    const [registerUser, { isLoading }] = useRegisterMutation();

    const navigate = useNavigate()

    const user = useAppSelector((state) => state.auth.user)
    if (user) {
        return <Navigate to="/" replace />
    }


    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setServerError('')
        const fname = e.target[0].value;
        const lname = e.target[1].value;
        const email = e.target[2].value;
        if (!emailValidation(email).valid) {
            setFormError(prev => ({ ...prev, email: emailValidation(email).message }));
            return;
        }
        setFormError(prev => ({ ...prev, email: '' }));

        const password = e.target[3].value;
        if (!passwordValidation(password).valid) {
            setFormError(prev => ({ ...prev, password: passwordValidation(password).message }));
            return;
        }
        setFormError(prev => ({ ...prev, password: '' }));


        const confirmPassword = e.target[4].value;
        if (!passwordValidation(confirmPassword).valid) {
            setFormError(prev => ({ ...prev, confirmPassword: passwordValidation(confirmPassword).message }));
            return;
        }
        setFormError(prev => ({ ...prev, confirmPassword: '' }));
        if (password !== confirmPassword) {
            setFormError(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
            return;
        }
        setFormError(prev => ({ ...prev, confirmPassword: '' }));

        try {
            const response = await registerUser({ email, password, firstName: fname, lastName: lname }).unwrap();
            console.log(response)
            e.target.reset()
            navigate('/login')
        } catch (e: any) {
            setServerError(e.data.message)
        }
    }

    return (
        <AuthCard>
            <h1 className=" text-2xl font-bold text-white mb-1 ">Register</h1>
            {serverError && <ErrorMessage>{serverError}</ErrorMessage>}
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
                <Input className={cn(formError.email && 'border-red-500')} id="email" placeholder="name@company.com" type="email" />
                {formError.email && <ErrorMessage>{formError.email}</ErrorMessage>}
                <label htmlFor="password" className=" self-start">Password </label>
                <Input className="" id="password" placeholder="Password" />
                {formError.password && <ErrorMessage>{formError.password}</ErrorMessage>}
                <label htmlFor="confirm-password" className=" self-start">Confirm Password </label>
                <Input className="" id="confirm-password" placeholder="Confirm Password" type="password" />
                {formError.confirmPassword && <ErrorMessage>{formError.confirmPassword}</ErrorMessage>}

                <Button size={'medium'} className=" my-2 w-full flex items-center justify-center  " disabled={isLoading} intent={'secondary'} type="submit">
                    {isLoading ? <span className=" animate-spin"><Icons.Loader className=" h-6 w-6" /> </span> : "Register"}

                </Button>
            </Form>
            {/* <div className="w-[95%] border-b border-gray-200"></div> */}
            <div className=" flex items-center gap-2">
                <p className=" text-white ">Already have an account? </p>
                <Button className=" hover:bg-transparent text-white  " disabled={isLoading} onClick={() => navigate('/login')}>
                    Login
                </Button>
            </div>
        </AuthCard>
    )
}

export default Signup

