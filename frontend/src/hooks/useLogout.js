import { useAuthContext } from './useAuthContext'
import { useSleepsContext } from './useSleepsContext'

export const useLogout = () => {
  const { auth, dispatch } = useAuthContext()
  const { dispatch: dispatchSleeps } = useSleepsContext()

  const logout = async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.accessToken}`
      }
    })

    if (response.ok) {
      dispatch({ type: 'LOGOUT' })
      dispatchSleeps({ type: 'SET_SLEEPS', payload: null })
    }
  }

  return { logout }
}