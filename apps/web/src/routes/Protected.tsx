import { useAppSelector } from "@/redux/hooks";
import { Navigate, Outlet } from "react-router";
import "../index.css";


const Protected = () => {

    const token = useAppSelector((state) => state.auth.accessToken);


    if (!token) {
        return <Navigate to="/login" />
    }

    return (
        <Outlet />
    )
}

export default Protected