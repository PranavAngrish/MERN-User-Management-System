import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Button, Form, Modal } from 'react-bootstrap'
import { useUserContext } from '../../hooks/useUserContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { BiArrowBack } from 'react-icons/bi'
import { BsPlusLg } from 'react-icons/bs'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const Add = () => {
  const navigate = useNavigate()
  const axiosPrivate = useAxiosPrivate()
  const { dispatch } =  useUserContext()
  const { auth } = useAuthContext()
  const [error, setError] = useState(null)
  const [show, setShow] = useState(false)
  const [changeIcon, setChangeIcon] = useState(false)
  const [active, setActive] = useState(false)
  const nameRef = useRef('')
  const emailRef = useRef('')
  const passwordRef = useRef('')
  const rolesRef = useRef([])
  const activeRef = useRef('')

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

  const handleAdd = async () => {
    if (!auth) {
      setError('You must be logged in')
      return
    }

    const addUser = { name: nameRef.current.value, email: emailRef.current.value, password: passwordRef.current.value, roles: [rolesRef.current.value], active: activeRef.current.checked}
   
    try {
      const response = await axiosPrivate.post('/api/users', addUser)
      dispatch({type: 'CREATE_USER', payload: response.data})
      setError(null)
      setShow(false)
    } catch (error) {
      // console.log(error)
      setError(error.response?.data.error)
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between">
        <button className="btn btn-outline-primary mb-2" onClick={() => navigate('/', {replace: true})}><BiArrowBack /></button>
        <button className="btn btn-outline-primary mb-2" onClick={() => setShow(!show)}><BsPlusLg /></button>
      </div>

      <Modal show={show} onHide={() => {setShow(!show);setError(null)}} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User Record</Modal.Title>
        </Modal.Header> 
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name:</Form.Label>
            <Form.Control type="text" ref={nameRef}/>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email:</Form.Label>
            <Form.Control type="text" ref={emailRef}/>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password: </Form.Label>
            <div className="d-flex">
              <Form.Control type="password" ref={passwordRef} autoComplete="on"/>
              <Button variant="default" className="mb-2" onClick={handleShowPassword}>{changeIcon ? <FaEyeSlash/> : <FaEye/>}</Button>
            </div>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Roles:</Form.Label>
            <select className="form-select" aria-label="select roles" ref={rolesRef} defaultValue={"User"}>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Label>Active:</Form.Label>
            <Form.Check type="switch" ref={activeRef} defaultChecked={active} onClick={() => setActive(!active)}/>
          </Form.Group>
          {error && (<Alert variant={'danger'}>{error}</Alert>)}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleAdd}>Add User</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Add