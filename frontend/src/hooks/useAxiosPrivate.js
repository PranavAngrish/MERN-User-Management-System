import { useEffect } from "react" 
import { axiosPrivate } from "../api/axios" 
import { useAuthContext } from "../hooks/useAuthContext"
import { useLogout } from '../hooks/useLogout'
import useRefreshToken from "./useRefreshToken" 

const useAxiosPrivate = () => {
    const { logout } = useLogout()
    const {user} = useAuthContext()
    const refresh = useRefreshToken() 

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${user.accessToken}` 
                }
                return config 
            }, (error) => Promise.reject(error)
        ) 

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config
                if (error?.response?.status === 403 && error?.response?.data.error === "Forbidden token expired" && !prevRequest?.sent) {
                    prevRequest.sent = true 
                    const newAccessToken = await refresh() 
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}` 
                    return axiosPrivate(prevRequest) 
                }
                return Promise.reject(error) 
            }
        ) 

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept) 
            axiosPrivate.interceptors.response.eject(responseIntercept) 
        }
    }, [user, refresh])

    return axiosPrivate 
}

export default useAxiosPrivate 