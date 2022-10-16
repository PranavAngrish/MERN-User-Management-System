import axios from '../api/axios' 
import { useAuthContext } from "../hooks/useAuthContext" 
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
            console.log(error)
            if((error.response.status === 403 && error.response.data.error === "Forbidden") || error.response.status === 401){
                logout()
                return
            }
        }

    }
    return refresh 
} 

export default useRefreshToken 