import { useRef, useEffect, useState } from 'react'
import { MdSpaceDashboard, MdOutlineVerifiedUser } from 'react-icons/md'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import Loading from '../../components/Loading'
import axios from '../../api/axios' 

const Activate = () => {
    const navigate = useNavigate()
    const { activation_token } = useParams()
    const [ error, setError ] = useState(null)
    const [ isLoading, setIsLoading ] = useState(false)
    const { dispatch } = useAuthContext()
    const executeOnce = useRef(false)

    useEffect(() => {
      let isMounted = true
      const abortController = new AbortController()
        
      if(!activation_token) navigate('/not-found')

      const activateAccount = async () => {
        setIsLoading(true)
        setError(null) 

        try {
          const response = await axios.post('/api/auth/activate', { 
            activation_token,
            signal: abortController.signal
          })
          isMounted && dispatch({type: 'LOGIN', payload: response.data})
          setIsLoading(false)
        } catch (error) {
          setIsLoading(false)
          setError(error.response.data.error)
          navigate('/not-found')
        }
      }
      
      if (executeOnce.current === true || process.env.NODE_ENV !== 'development') {
        activateAccount()
      }

      return () => { 
        isMounted = false 
        executeOnce.current = true
        abortController.abort()
      }
    }, [])

    return (
        <>
          {isLoading && (<Loading />)}

          <div className="popup center shadow">
            <div className="icon">
              <MdOutlineVerifiedUser className="fa"/>
            </div>
            <div className="fs-3 fw-semibold">Account Activated</div>
            <div className="description">Your email has been confirmed, check dashboard for more details.</div>
            <div className="dismiss-btn mt-3">
              <Link to="/"><button><MdSpaceDashboard />&nbsp;DASHBOARD</button></Link>
            </div>
          </div>
        </>
    )
}

export default Activate