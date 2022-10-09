import axios from '../api/axios' 
import { useAuthContext } from "../hooks/useAuthContext" 

const useRefreshToken = () => {
    const {user, dispatch} = useAuthContext()

    const refresh = async () => {
        const response = await axios.post('/api/auth/refresh', {
            withCredentials: true
        }) 

        dispatch({type: 'LOGIN', payload: {...user, accessToken: response.data.accessToken}})

        return {accessToken: response.data.accessToken, response} 
    }
    return refresh 
} 

export default useRefreshToken 