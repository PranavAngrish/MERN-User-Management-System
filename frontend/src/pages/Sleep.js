import { useEffect } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { useSleepsContext } from '../hooks/useSleepsContext'
import { useLocation } from 'react-router-dom'
import { BsFillPersonFill } from "react-icons/bs"
import { FaAddressCard } from "react-icons/fa"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import Details from '../components/sleeps/Index'
import SleepForm from '../components/sleeps/Add'

const Sleep = () => {
  const {auth} = useAuthContext()
  const {sleeps, dispatch} = useSleepsContext()
  const axiosPrivate = useAxiosPrivate()
  const location = useLocation()
  const { userId, userName, userEmail, userRoles } = location.state ?? ""

  useEffect(() => {
    let isMounted = true
    const abortController = new AbortController()

    const getSleeps = async () => {
      try {
        const response = await axiosPrivate.get('/api/sleeps', {
          signal: abortController.signal
        })
        isMounted && dispatch({type: 'SET_SLEEPS', payload: response.data})
      } catch (err) {
        // console.log(err)
      }
    }

    const adminGetSleeps = async () => {
      try {
        const response = await axiosPrivate.post('/api/sleeps/admin', {
          id: userId,
          signal: abortController.signal
        })
        isMounted && dispatch({type: 'SET_SLEEPS', payload: response.data})
      } catch (err) {
        // console.log(err)
      }
    }

    if(auth){
      if(userId && (auth.email !== userEmail) && (auth.roles == "Admin")){
        adminGetSleeps()
      }else{
        getSleeps()
      }
    }

    return () => {
      isMounted = false
      abortController.abort()
    }
  }, [axiosPrivate, dispatch, auth])

  return (
    <>
     {userName && (<div className="bg-primary bg-opacity-25 rounded pt-2">
        <span className="mx-3 d-inline-flex align-items-center"><FaAddressCard className="fs-4"/>&ensp;{userName}</span>
        <span className="d-inline-flex align-items-center"><BsFillPersonFill className="fs-4"/>&ensp;{userRoles}</span>
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