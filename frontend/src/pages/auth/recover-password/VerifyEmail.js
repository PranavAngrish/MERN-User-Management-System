import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdOutlineMailLock } from 'react-icons/md'
import axiosPublic from '../../../api/axios' 
import RestPassword from './RestPassword'
import VerifyOTP from './VerifyOTP'

const VerifyEmail = () => {
  const emailRef = useRef('')
  const navigate = useNavigate()
  const [ email, setEmail ] = useState(null)
  const [ mailVerify, setMailVerify] = useState(false)
  const [ otpVerify, setOTPVerify ] = useState(false)
  const [ error, setError ] = useState(null)

  const  handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axiosPublic.post('/api/auth/verify-email', {email: emailRef.current.value.trim()})
      setMailVerify(response.data.mailVerify)
      setEmail(response.data.email)
      // navigate('/not-found')
    } catch (error) {
      setError(error.response.data.error)
    }
  }

  return (
    <>
      {!mailVerify && (<div className="otp-container">
          <div className="row justify-content-center">
            <div className="col text-center">
              <div className="otp-box">
                <div className="otp-icon"><MdOutlineMailLock className="fa"/></div>           
                <h3>Forgot Your Password ?</h3>
                <div className="description">Please enter your email address. We will send a one-time password (OTP) to this address for verification.</div>
                <form onSubmit={handleSubmit}>
                  <input className="inputs" type="email" ref={emailRef} placeholder='Email Address'/>
                  <button type="submit" className="otp-button btn btn-primary mb-1">Next</button>
                </form>
                {error && <div className="error">{error}</div>}
              </div>
              <div className="signup-prompt mt-2">Back to <Link to="/">Home Page</Link></div>
            </div>
          </div>
        </div>)}

      {mailVerify && !otpVerify && <VerifyOTP setOTPVerify={setOTPVerify} email={email}/>}

      {mailVerify && otpVerify && <RestPassword email={email}/>}
    </>
  )
}

export default VerifyEmail