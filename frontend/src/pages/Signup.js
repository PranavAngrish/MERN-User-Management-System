import { useRef, useState } from 'react'
// import { useSignup } from '../hooks/useSignup'
import { Link } from 'react-router-dom'
import { AiOutlineReload } from 'react-icons/ai'
import { BsInfoCircleFill } from 'react-icons/bs'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { TbMailForward } from 'react-icons/tb'
import { VscError } from 'react-icons/vsc'
import usePersist from '../hooks/usePersist'

const Signup = () => {
  // const {signup, error, isLoading} = useSignup()
  const {persist, setPersist} = usePersist()
  const [changeIcon, setChangeIcon] = useState(false)
  const [verify, setVerify] = useState(false)
  const nameRef = useRef('')
  const emailRef = useRef('')
  const passwordRef = useRef('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    // await signup(nameRef.current.value, emailRef.current.value.trim(), passwordRef.current.value.trim())
    setIsLoading(true)
    setError(null)

    const user = {name: nameRef.current.value, email: emailRef.current.value.trim(), password: passwordRef.current.value.trim()}
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(user)
    })

    const json = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    
    if (response.ok) {
      setVerify(json.mailSent)
      setIsLoading(false)
    }
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
      {!verify && (
        <>
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
            <div className="form-check mt-3">
              <label htmlFor="persist" className="form-check-label">
                <input id="persist" className="form-check-input" type="checkbox" onChange={() => {setPersist(prev => !prev)}} checked={persist}/>
                <div className="mx-2" style={{paddingTop:"2px"}}>Keep me logged in</div>
              </label>
            </div>
            {error && 
              (<div className="error">{error}
                {error==="Password not strong enough" && 
                  (<ul>
                    <li>At least 8 character</li>
                    <li>At least 1 lowercase</li>
                    <li>At least 1 uppercase</li>
                    <li>At least 1 numbers</li>
                    <li>At least 1 symbols</li>
                  </ul>)}
              </div>)}
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
      )}

    {/* <div className="popup center shadow">
      <div className="icon">
        <VscError className="fa"/>
      </div>
      <div className="fs-3 fw-semibold">Account Activated</div>
      <div className="description">Your email has been confirmed, check dashboard for more details.</div>
      <div className="dismiss-btn mt-3">
        <Link to="/signup"><button><AiOutlineReload />&nbsp;Try Again</button></Link>
      </div>
    </div> */}

    {verify && (<div className="popup center shadow">
      <div className="icon">
        <TbMailForward className="fa"/>
      </div>
      <div className="fs-3 fw-semibold">Verify your email</div>
      <div className="description">We've sent you a link in your email to verify your email address and activateyour account. Just click the link to complete the signup process</div>
      <div className="description">The link in the email will expire in 15 minutes.</div>
    </div>)}
   </>
  )
}

export default Signup