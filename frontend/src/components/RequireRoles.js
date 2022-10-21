import { Navigate, Outlet } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'

const RequireRoles = ({ Roles }) => {
    const { auth } = useAuthContext()
    const checkRoles = auth.roles.find(role => Roles.includes(role))
    return (checkRoles && auth ? <Outlet /> : <Navigate to="/" />) 
}

export default RequireRoles 