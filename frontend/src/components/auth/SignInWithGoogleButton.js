
import { useState } from 'react'
import { FcGoogle } from "react-icons/fc"
import { BsInfoCircleFill } from 'react-icons/bs'
import { Button, Modal } from 'react-bootstrap'
import usePersist from '../../hooks/usePersist' 

const SignInWithGoogleButton = () => {
  const { persist, setPersist } = usePersist()
  const [ show, setShow ] = useState(false)

  const handleLogin = () => {
    console.log(persist)
    window.location.href = `${process.env.REACT_APP_SERVER_URL}/api/auth/google?persist=${persist}`
  }

  return (
    <>
      <button className="btn btn-light google-sign-in" onClick={() => setShow(!show)}>
        <FcGoogle className="me-2" size={17}/>
        Sign in with Google
      </button>

      <Modal show={show} onHide={() => {setShow(!show)}} centered>
        <Modal.Body>
          <div className="form-check mt-2 mb-3">
            <label htmlFor="persist" className="form-check-label">
              <input id="persist" className="form-check-input fw-bold" type="checkbox" onChange={() => {setPersist(prev => !prev)}} checked={persist}/>
              <strong>Keep me logged in</strong>
            </label>
          </div>

          <div className="alert alert-info" role="alert" style={{maxWidth: "467px"}}>
            <div className="d-flex align-items-center mx-3">
              <BsInfoCircleFill/><div className="mx-2"><strong>Info:</strong></div>
            </div>
            <ul>
              <li>Choosing <strong>"Keep me logged in"</strong> reduces the number of the times you're asked Login on this device.</li>
              <li>To keep your account secure, use this option only on <strong>Trusted Devices</strong>.</li>
            </ul>
          </div>
          <Button className="float-end" variant="primary" onClick={handleLogin}>CONTINUE</Button>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default SignInWithGoogleButton
