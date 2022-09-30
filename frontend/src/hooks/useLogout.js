import { useAuthContext } from './useAuthContext'
import { useSleepsContext } from './useSleepsContext'

export const useLogout = () => {
  const { dispatch } = useAuthContext()
  const { dispatch: dispatchSleeps } = useSleepsContext()

  const logout = () => {
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
    dispatchSleeps({ type: 'SET_SLEEPS', payload: null })
  }

  return { logout }
}