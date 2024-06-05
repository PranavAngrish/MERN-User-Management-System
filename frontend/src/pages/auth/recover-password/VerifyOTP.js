import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdOutlineSecurity } from "react-icons/md"
import axiosPublic from '../../../api/axios' 

const VerifyOTP = ({ email, setOTPVerify }) => {
  const otpRefs = useRef([...Array(6)].map(() => React.createRef()))
  const navigate = useNavigate()
  const [ error, setError ] = useState(null)

  const  handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const otp = otpRefs.current.map(ref => ref.current.value).join('')
      const response = await axiosPublic.post('/api/auth/verify-OTP', { email, otp })
      setOTPVerify(response.data.otpVerified)
      setError(null)
    } catch (error) {
      setError(error.response.data.error)
      if(!error.response.data.otpVerifie){
        setTimeout(() => navigate('/not-found'), 7000)
      }
    }
  }

  return (
    <div className="otp-container">
      <div className="row justify-content-center">
        <div className="col text-center">
          <div className="otp-box">
            <div className="otp-icon"><MdOutlineSecurity className="fa"/></div>           
            <h3>OTP Valification</h3>
            <div className="description">A 6-digit OTP (One-Time Password) has been sent to {email}. Kindly check your email and enter the OTP code below.</div>
            <form onSubmit={handleSubmit}>
              <div className="otp-inputs gap-2 my-4">
                {[...Array(6)].map((_, index) => (<input className="otp-input" key={index} type="tel" min="0" maxLength="1" ref={otpRefs.current[index]}/>))}
              </div>
              <button type="submit" className="otp-button btn btn-primary mb-1">Verify OTP</button>
            </form>
            {error && <div className="error">{error}</div>}
          </div>
          <div className="signup-prompt mt-2">Back to <Link to="/">Home Page</Link></div>
        </div>
      </div>
    </div>
  )
}

export default VerifyOTP