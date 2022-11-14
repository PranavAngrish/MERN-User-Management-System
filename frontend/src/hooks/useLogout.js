import { useAuthContext } from './useAuthContext'
import { useSleepsContext } from './useSleepsContext'
import { useUserContext } from './useUserContext'
import usePersist from './usePersist'
import axios from '../api/axios' 

export const useLogout = () => {
  const { dispatch } = useAuthContext()
  const { dispatch: dispatchSleeps } = useSleepsContext()
  const { dispatch: dispatchUsers } = useUserContext()
  const { setPersist } = usePersist()

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout')
      dispatch({ type: 'LOGOUT' })
      dispatchUsers({ type: 'SET_USER', payload: null })
      dispatchSleeps({ type: 'SET_SLEEPS', payload: null })
      setPersist(false)
    } catch (error) {
      // console.log(error)
    }
  }

  return { logout }
}