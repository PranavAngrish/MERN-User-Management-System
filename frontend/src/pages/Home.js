import { useEffect } from 'react'
import { useAuthContext } from "../hooks/useAuthContext"
import { useSleepsContext } from '../hooks/useSleepsContext'
import SleepDetails from "../components/SleepDetails"
import SleepForm from "../components/SleepForm"

const Home = () => {
  const {user} = useAuthContext()
  const {sleeps, dispatch} = useSleepsContext()

  useEffect(() => {
    const fetchSleeps = async () => {
      const response = await fetch('/api/sleeps', {
        headers: {'Authorization': `Bearer ${user.token}`},
      })
      const json = await response.json()

      if (response.ok){
        dispatch({type: 'SET_SLEEPS', payload: json})
      }
    }

    if (user) {
      fetchSleeps()
    }
  }, [dispatch, user])

  return (
    <div className="home">
      <div className="sleeps">
        {sleeps && sleeps.map(sleep => (
          <SleepDetails sleep={sleep} key={sleep._id} />
        ))}
      </div>
      <SleepForm />
    </div>
  )
}

export default Home