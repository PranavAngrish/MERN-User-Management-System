import { useState } from 'react'
import { FaEye } from 'react-icons/fa'
import { Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { usePathContext } from '../../context/path'
import { useUserContext } from '../../hooks/useUserContext'

const View = ({user}) => {
  const [show, setShow] = useState(false)
  const { setTitle } = usePathContext()
  const { setTargetUser } = useUserContext()

  const handleClick = (title) => {
    setTitle(title + " Management")
    setTargetUser({ userId: user._id, userName: user.name, userEmail: user.email, userRoles: user.roles })
  }   

  return (
    <>
        <button className="btn btn-outline-secondary p-1" onClick={() => setShow(!show)}><FaEye className="fs-4"/></button>

        <Modal show={show} onHide={() => {setShow(!show)}} centered>
            <Modal.Header closeButton>View User Record</Modal.Header> 
            <Modal.Body>
              <Link to="/sleep" onClick={() => handleClick("Sleep")}>Sleep</Link><br/>
              <Link to="/note" onClick={() => handleClick("Note")}>Note</Link>
            </Modal.Body>
        </Modal>
    </>
  )
}

export default View