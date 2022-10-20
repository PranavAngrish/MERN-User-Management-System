import { useLocation, Navigate, Outlet } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'

const RequireAuth = ({ Roles }) => {
    const { auth } = useAuthContext()
    const location = useLocation() 
    const checkRoles = auth.roles.find(role => Roles.includes(role))

    return (
        checkRoles && auth ? <Outlet /> : <Navigate to="/" />
    ) 
}

export default RequireAuth 