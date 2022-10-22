import { useState } from 'react'
import { FaEye } from 'react-icons/fa'
import { Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { usePathContext } from '../../context/path'

const View = ({user}) => {
  const [show, setShow] = useState(false)
  const { setTitle, setLink } = usePathContext()

  const handleClick = (title) => {
    setTitle(title + " Management")
    setLink('/' + title.toLowerCase())
  }   

  return (
    <>
        <button className="btn btn-outline-secondary p-1" onClick={() => setShow(!show)}><FaEye className="fs-4"/></button>

        <Modal show={show} onHide={() => {setShow(!show)}} centered>
            <Modal.Header closeButton>View User Record</Modal.Header> 
            <Modal.Body>
                <Link to="/sleep" onClick={() => handleClick("Sleep")} state={{ userId: user._id, userName: user.name, userEmail: user.email, userRoles: user.roles }}>Sleep</Link><br/>
                <Link to="/note" onClick={() => handleClick("Note")} state={{ userId: user._id, userName: user.name, userEmail: user.email, userRoles: user.roles }}>Note</Link>
            </Modal.Body>
        </Modal>
    </>
  )
}

export default View