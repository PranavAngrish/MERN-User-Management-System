import { Outlet } from "react-router-dom" 
import { useState, useEffect } from "react" 
import { useAuthContext } from '../hooks/useAuthContext'
import useRefreshToken from '../hooks/useRefreshToken' 
import usePersist from '../hooks/usePersist'

const PersistLogin = () => {
    const refresh = useRefreshToken() 
    const { auth } = useAuthContext()
    const {persist} = usePersist()
    const [isLoading, setIsLoading] = useState(true) 

    useEffect(() => {
        let isMounted = true 

        const verifyRefreshToken = async () => {
            try {
                await refresh() 
            }catch (err) {
                console.error(err) 
            }finally {
                isMounted && setIsLoading(false) 
            }
        }

        !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false) 

        return () => isMounted = false 
    }, [])

    return (
        <>
            {!persist ? <Outlet /> : isLoading ? <p>Loading...</p> : <Outlet />}
        </>
    )
}

export default PersistLogin