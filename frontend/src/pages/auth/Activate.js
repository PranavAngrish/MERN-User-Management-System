import { useRef, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuthContext } from '../../context/auth'
import { MdSpaceDashboard, MdOutlineVerifiedUser } from 'react-icons/md'
import { AiOutlineReload } from 'react-icons/ai'
import { VscError } from 'react-icons/vsc'
import Loading from '../../components/Loading'
import axios from '../../api/axios' 

const Activate = () => {
  const navigate = useNavigate()
  const { dispatch } = useAuthContext()
  const { activation_token } = useParams()
  const [ activate, setActivate ] = useState(false)
  const [ expire, setExpire ] = useState(false)
  const [ inUse, setInUse ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(false)
  const executeOnce = useRef(false)

  useEffect(() => {
    let isMounted = true
    const abortController = new AbortController()
      
    if(!activation_token) navigate('/not-found')

    const activateAccount = async () => {
      setIsLoading(true)

      try {
        const response = await axios.post('/api/auth/activate', { 
          activation_token,
          signal: abortController.signal
        })
        isMounted && dispatch({type: 'LOGIN', payload: response.data})
        setIsLoading(false)
        setActivate(true)
      } catch (error) {
        setIsLoading(false)
        if(error.response.data.error === "Forbidden token expired"){ 
          setExpire(true) 
        }else if(error.response.data.error === "Email already in use"){
          setInUse(true)
        }else{
          navigate('/not-found')
        }
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

      {expire && (<div className="expire center shadow">
        <div className="icon">
          <VscError className="fa"/>
        </div>
        <div className="fs-3 fw-semibold">Link Expired</div>
        <div className="description">The link provided has expired, please click the button below to signup for a new account.</div>
        <div className="dismiss-btn mt-3">
          <Link to="/signup"><button><AiOutlineReload />&ensp;Try Again</button></Link>
        </div>
      </div>)}

      {inUse && (<div className="in-use center shadow">
        <div className="icon">
          <VscError className="fa"/>
        </div>
        <div className="fs-3 fw-semibold">Email already in use</div>
        <div className="description">This email is already in use, please choose another email.</div>
        <div className="dismiss-btn mt-3">
          <Link to="/signup"><button><AiOutlineReload />&ensp;Try Again</button></Link>
        </div>
      </div>)}

      {activate && (<div className="popup center shadow">
        <div className="icon">
          <MdOutlineVerifiedUser className="fa"/>
        </div>
        <div className="fs-3 fw-semibold">Account Activated</div>
        <div className="description">Your email has been confirmed, check dashboard for more details.</div>
        <div className="dismiss-btn mt-3">
          <Link to="/"><button><MdSpaceDashboard />&ensp;DASHBOARD</button></Link>
        </div>
      </div>)}
    </>
  )
}

export default Activate