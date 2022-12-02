import axios from '../api/axios' 
import { useAuthContext } from '../context/auth' 
import { useLogout } from '../hooks/useLogout'

const useRefreshToken = () => {
    const { dispatch } = useAuthContext()
    const { logout } = useLogout()

    const refresh = async () => {
        try {
            const response = await axios.post('/api/auth/refresh', {
                withCredentials: true
            }) 
            dispatch({type: 'LOGIN', payload: response.data})
            return response.data.accessToken
        } catch (error) {
            // console.log(error)
            const wrongToken = (error.response.status === 403 && error.response.data.error === "Forbidden")
            const userNotFound = error.response.status === 401
            const isBlocked = error.response.status === 400
            if(wrongToken || userNotFound || isBlocked){
                logout()
                return
            }
        }

    }
    return refresh 
} 

export default useRefreshToken 