import { useAuthContext } from './useAuthContext'
import { useSleepsContext } from './useSleepsContext'

export const useLogout = () => {
  const { user, dispatch } = useAuthContext()
  const { dispatch: dispatchSleeps } = useSleepsContext()

  const logout = async () => {
    // localStorage.removeItem('user')

    const response = await fetch('/api/user/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
    })

    if (response.ok) {
        dispatch({ type: 'LOGOUT' })
        dispatchSleeps({ type: 'SET_SLEEPS', payload: null })
    }
  }

  return { logout }
}