import { useState } from "react"
import { useSignup } from "../hooks/useSignup"

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {signup, error, isLoading} = useSignup()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await signup(name, email, password)
  }

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Sign Up</h3>
      <label>Username:</label>
      <input type="text" onChange={(e) => setName(e.target.value)} value={name} />
      <label>Email Address:</label>
      <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} />
      <label>Password:</label>
      <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
      <button disabled={isLoading}>Sign Up</button>
      {error && <div className="error">{error}{error==="Password not strong enough" && (
          <ul>
            <li>At least 8 character</li>
            <li>At least 1 lowercase</li>
            <li>At least 1 uppercase</li>
            <li>At least 1 numbers</li>
            <li>At least 1 symbols</li>
            </ul>
      )}</div>}
    </form>
  )
}

export default Signup