import { useEffect } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { useSleepsContext } from '../hooks/useSleepsContext'
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import Details from '../components/sleeps/Index'
import SleepForm from '../components/sleeps/Add'

const Sleep = () => {
  const {auth} = useAuthContext()
  const {sleeps, dispatch} = useSleepsContext()
  const axiosPrivate = useAxiosPrivate()

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

    if(auth){
      getSleeps()
    }

    return () => {
      isMounted = false
      abortController.abort()
    }
  }, [axiosPrivate, dispatch, auth])

  return (
    <div className="sleeps">
      <div>
        {sleeps && sleeps.map(sleep => (
          <Details sleep={sleep} key={sleep._id} />
        ))}
      </div>
      <SleepForm />
    </div>
  )
}

export default Sleep