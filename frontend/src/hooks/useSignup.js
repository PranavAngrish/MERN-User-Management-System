import { useState } from 'react'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const [mailSent, setMailSent] = useState(false)

  const signup = async (name, email, password) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, email, password })
    })

    const json = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    
    if (response.ok) {
      setMailSent(json.mailSent)
      setIsLoading(false)
    }
  }

  return { signup, isLoading, error, mailSent }
}