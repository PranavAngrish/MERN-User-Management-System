import { useEffect } from 'react'
import { ROLES } from '../config/roles'
import { usePathContext } from '../context/path'
import { useUserContext } from '../hooks/useUserContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { useSleepsContext } from '../hooks/useSleepsContext'
import { BsFillPersonFill } from "react-icons/bs"
import { FaAddressCard } from "react-icons/fa"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import Details from '../components/sleeps/Index'
import SleepForm from '../components/sleeps/Add'

const Sleep = () => {
  const { auth } = useAuthContext()
  const { targetUser } = useUserContext()
  const { sleeps, dispatch } = useSleepsContext()
  const { setTitle } = usePathContext()
  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    let isMounted = true
    const abortController = new AbortController()
    setTitle("Sleep Hour Management")

    const getSleeps = async () => {
      try {
        let response
        if(targetUser?.userId && (auth.email !== targetUser.userEmail) && (auth.roles == ROLES.Admin)){
          // Admin view
          response = await axiosPrivate.post('/api/sleeps/admin', {
            id: targetUser.userId,
            signal: abortController.signal
          })
        }else{
          response = await axiosPrivate.get('/api/sleeps', {
            signal: abortController.signal
          })
        }
        isMounted && dispatch({type: 'SET_SLEEPS', payload: response.data})
      } catch (err) {
        dispatch({type: 'SET_SLEEPS', payload: []})
        // console.log(err)
      }
    }

    if(auth){
      getSleeps()
    }

    return () => {
      isMounted = false
      abortController.abort()
    }
  }, [axiosPrivate, dispatch, auth])

  return (
    <>
     {targetUser?.userName && sleeps && (<div className="bg-primary bg-opacity-25 rounded pt-2">
        <span className="mx-3 d-inline-flex align-items-center"><FaAddressCard className="fs-4"/>&ensp;{targetUser?.userName}</span>
        <span className="d-inline-flex align-items-center"><BsFillPersonFill className="fs-4"/>&ensp;{targetUser?.userRoles}</span>
      </div>)}
      <div className="sleeps mt-3">
        <div>
          {sleeps && sleeps.map(sleep => (
            <Details sleep={sleep} key={sleep._id} />
          ))}
        </div>
        <SleepForm />
      </div>
    </>
  )
}

export default Sleep