import { useCallback, useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

export const useLogin = () => {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const { dispatch } = useAuthContext()
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)

  const login = async (email, password) => {
    if (!executeRecaptcha) {
      setError('Execute recaptcha not yet available')
      return
    }

    const token = await executeRecaptcha("enquiryFormSubmit")
    setIsLoading(true)
    setError(null)

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password, token})
    })
    
    const json = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }

    if (response.ok) {
      dispatch({type: 'LOGIN', payload: json})
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}