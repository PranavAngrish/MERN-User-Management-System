import { useEffect, useState } from 'react'
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

    useEffect(() => {
      // let isMounted = true
        
      // if(!activation_token) navigate('/not-found')

      // const activateAccount = async () => {
      //   setIsLoading(true)
      //   setError(null) 

      //   try {
      //     const response = await axios.post('/api/auth/activate', { activation_token })
      //     isMounted && dispatch({type: 'LOGIN', payload: response.data})
      //     setIsLoading(false)
      //   } catch (error) {
      //     setIsLoading(false)
      //     setError(error.response.data.error)
      //     navigate('/not-found')
      //   }

        // const response = await fetch('/api/auth/activate', {
        //   method: 'POST',
        //   headers: {'Content-Type': 'application/json'},
        //   body: JSON.stringify({ activation_token })
        // })
        
        // const json = await response.json()
        
        // if (!response.ok){
        //   setIsLoading(false)
        //   setError(json.error)
        // }

        // if (response.ok) {
        //   isMounted && dispatch({type: 'LOGIN', payload: json})
        //   setIsLoading(false)
        // }
      // }
      
      // activateAccount()
    
        // return () => { isMounted = false }
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