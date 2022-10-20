import { useAuthContext } from './useAuthContext'
import { useSleepsContext } from './useSleepsContext'
import { useUserContext } from './useUserContext'
import usePersist from './usePersist'

export const useLogout = () => {
  const { auth, dispatch } = useAuthContext()
  const { dispatch: dispatchSleeps } = useSleepsContext()
  const { dispatch: dispatchUsers } = useUserContext()
  const { setPersist } = usePersist()

  const logout = async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth?.accessToken}`
      }
    })

    if (response.ok) {
      dispatch({ type: 'LOGOUT' })
      dispatchUsers({ type: 'SET_USER', payload: null })
      dispatchSleeps({ type: 'SET_SLEEPS', payload: null })
      setPersist(false)
    }
  }

  return { logout }
}