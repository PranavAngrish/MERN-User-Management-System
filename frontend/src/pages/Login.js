import { useState } from "react"
import { useLogin } from "../hooks/useLogin"
import { Link } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {login, error, isLoading} = useLogin()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h3 className="text-center mb-4">Log In</h3>
      <label>Email address:</label>
      <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} />
      <label>Password:</label>
      <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
      <div className="signup-prompt">Create an account ? <Link to="/signup">Signup</Link></div>
      <button className="w-100 mt-2" disabled={isLoading}>Log In</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default Login