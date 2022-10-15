import { useRef, useState } from "react"
import { useSignup } from "../hooks/useSignup"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { Link } from 'react-router-dom'

const Signup = () => {
  const {signup, error, isLoading} = useSignup()
  const [changeIcon, setChangeIcon] = useState(false)
  const nameRef = useRef('')
  const emailRef = useRef('')
  const passwordRef = useRef('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    await signup(nameRef.current.value, emailRef.current.value.trim(), passwordRef.current.value.trim())
  }

  const handleShowPassword =  (e) => {
    e.preventDefault()
    if(passwordRef.current.type === "password") {
      passwordRef.current.type = "text"
      setChangeIcon(true)
    }else{
      passwordRef.current.type = "password"
      setChangeIcon(false)
    }
  }

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3 className="text-center mb-4">Sign Up</h3>
      <label>Username:</label>
      <input type="text" ref={nameRef} />
      <label>Email Address:</label>
      <input type="email" ref={emailRef}/>
      <label>Password:</label>
      <div className="d-flex">
          <input type="password" ref={passwordRef} autoComplete="off"/>
          <button className="btn mb-2" onClick={handleShowPassword}>{changeIcon ? <FaEyeSlash/> : <FaEye/>}</button>
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