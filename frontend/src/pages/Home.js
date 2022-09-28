import { useEffect }from 'react'
import { useAuthContext } from "../hooks/useAuthContext"

const Home = () => {
  const {user} = useAuthContext()

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch('', {
        headers: {'Authorization': `Bearer ${user.token}`},
      })
      const json = await response.json()

      if (response.ok){}
    }
    if (user) {}
  }, [user])

  return (
    <div className="home"></div>
  )
}

export default Home