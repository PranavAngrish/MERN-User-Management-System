import { Outlet, Navigate } from "react-router-dom" 
import { useAuthContext } from '../hooks/useAuthContext'

const RequireAuth = () => {
    const { auth } = useAuthContext()
    return ( <>{auth ? <Outlet /> : <Navigate to="/login" />}</>)
}

export default RequireAuth