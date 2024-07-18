import { FormEvent } from "react"
import { Button } from "../../button"

export const SignInCard = () => {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(e)
    }
    return (
        <div className=" flex flex-col items-center gap-4 text-white border p-4 rounded-xl backdrop-blur bg-white/10">
            <h1 className=" text-2xl font-bold text-white ">Login</h1>
            <form className=" flex flex-col items-center w-[20rem] gap-3" onSubmit={handleSubmit}>
                <input className=" w-[90%] rounded-lg bg-transparent border p-1 px-2 outline-none placeholder:text-white/80" placeholder="Username" type="text" />
                <input className=" w-[90%] rounded-lg bg-transparent border p-1 px-2 outline-none placeholder:text-white/80" placeholder="Password" type="text" />
                <div className=" flex items-center justify-between w-full">
                    <div>
                        <input type="checkbox" />
                        <label htmlFor="">Remember Me</label>
                    </div>
                    <Button>Forgot Password</Button>
                </div>
                <Button className=" w-full flex items-center justify-center " intent={'secondary'} type="submit">Login</Button>
                <div className=" flex items-center gap-2 w-full justify-center">
                    <p>Don't have account? </p>
                    <Button className="">Register</Button>
                </div>
            </form>
        </div>
    )
}