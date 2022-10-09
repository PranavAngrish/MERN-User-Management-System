import { useRef, useState } from "react"
import { useSignup } from "../hooks/useSignup"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { Link } from 'react-router-dom'

const Signup = () => {
  const {signup, error, isLoading} = useSignup()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isShow, setShow] = useState(false)
  const showPassRef = useRef()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await signup(name, email.trim(), password.trim())
  }

  const handleShowPassword =  (e) => {
    e.preventDefault()
    if(showPassRef.current.type === "password") {
      showPassRef.current.type = "text"
      setShow(true)
    }else{
      showPassRef.current.type = "password"
      setShow(false)
    }
  }

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3 className="text-center mb-4">Sign Up</h3>
      <label>Username:</label>
      <input type="text" onChange={(e) => setName(e.target.value)} value={name} />
      <label>Email Address:</label>
      <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} />
      <label>Password:</label>
      <div className="d-flex">
          <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} ref={showPassRef} autoComplete="off"/>
          <button className="btn mb-2" onClick={handleShowPassword}>{isShow ? <FaEyeSlash/> : <FaEye/>}</button>
        </div>
      <div className="signup-prompt">Already have an account ? <Link to="/login">Login</Link></div>
      <button className="w-100 mt-2" disabled={isLoading}>Sign Up</button>
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