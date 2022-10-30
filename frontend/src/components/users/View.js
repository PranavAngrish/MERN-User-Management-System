import { useState } from 'react'
import { FaEye } from 'react-icons/fa'
import { Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useUserContext } from '../../hooks/useUserContext'

const View = ({user}) => {
  const [show, setShow] = useState(false)
  const { setTargetUser } = useUserContext()

  const handleClick = () => {
    setTargetUser({ userId: user._id, userName: user.name, userEmail: user.email, userRoles: user.roles })
  }   

  return (
    <>
      <button className="btn btn-outline-secondary p-1" onClick={() => setShow(!show)}><FaEye className="fs-4"/></button>

      <Modal show={show} onHide={() => {setShow(!show)}} centered>
        <Modal.Header closeButton>View User Record</Modal.Header> 
        <Modal.Body>
          <Link to="/sleep" onClick={handleClick}>Sleep</Link><br/>
          <Link to="/note" onClick={handleClick}>Note</Link>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default View