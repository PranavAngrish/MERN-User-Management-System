import { useRef, useState } from 'react'
import { useLogin } from '../hooks/useLogin'
import { Link } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { BsInfoCircleFill } from 'react-icons/bs'
import usePersist from '../hooks/usePersist'

const Login = () => {
  const { login, error, isLoading } = useLogin()
  const { persist, setPersist } = usePersist()
  const [changeIcon, setChangeIcon] = useState(false)
  const emailRef = useRef('')
  const passwordRef = useRef('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(emailRef.current.value.trim(), passwordRef.current.value.trim())
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
    <>
      <form className="login" onSubmit={handleSubmit}>
        <h3 className="text-center mb-4">Log In</h3>
        <label>Email address:</label>
        <input className="inputs" type="email" ref={emailRef}/>
        <label>Password:</label>
        <div className="d-flex">
          <input className="inputs" type="password" ref={passwordRef} autoComplete="on"/>
          <button className="btn mb-2" onClick={handleShowPassword}>{changeIcon ? <FaEyeSlash/> : <FaEye/>}</button>
        </div>
        <div className="signup-prompt">Create an account ? <Link to="/signup">Signup</Link></div>
        <button className="w-100 mt-2" disabled={isLoading}>Log In</button>
        <div className="form-check mt-3">
          <label htmlFor="persist" className="form-check-label">
            <input id="persist" className="form-check-input" type="checkbox" onChange={() => {setPersist(prev => !prev)}} checked={persist}/>
            Keep me logged in
          </label>
        </div>
        {error && <div className="error">{error}</div>}
      </form>
      {persist && (<div className="alert alert-info" role="alert" style={{maxWidth: "400px", margin: "0 auto"}}>
        <div className="d-flex align-items-center mx-3">
          <BsInfoCircleFill/><div className="mx-2"><strong>Info:</strong></div>
        </div>
        <ul>
          <li>Choosing <strong>"Keep me logged in"</strong> reduces the number of the times you're asked Login on this device.</li>
          <li>To keep your account secure, use this option only on <strong>trusted devices</strong>.</li>
        </ul>
      </div>)}
    </>
  )
}

export default Login