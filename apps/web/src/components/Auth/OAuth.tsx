import { setAccessToken } from "@/redux/features/auth"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { Navigate, useSearchParams } from "react-router"

const OAuth = () => {
    const [searchParams] = useSearchParams()
    const dispatch = useAppDispatch()
    const accessToken = searchParams.get('accessToken')
    const user = useAppSelector((state) => state.auth.user)


    if (accessToken) {
        dispatch(setAccessToken(accessToken))
        return <Navigate to="/" replace />
    }

    if (user) {
        return <Navigate to="/" replace />
    }


    return (
        <Navigate to="/login" replace />
    )
}

export default OAuth