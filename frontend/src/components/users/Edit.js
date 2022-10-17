import { useRef, useState } from 'react'
import { BsPencilSquare } from "react-icons/bs"
import { Alert, Button, Form, Modal } from 'react-bootstrap'
import { useUserContext } from '../../hooks/useUserContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
const validator = require('validator')

const Edit = ({user}) => {
  const axiosPrivate = useAxiosPrivate()
  const { dispatch } =  useUserContext()
  const { auth } = useAuthContext()
  const [error, setError] = useState(null)
  const [show, setShow] = useState(false)
  const nameRef = useRef('')
  const emailRef = useRef('')
  const rolesRef = useRef('')
  const activeRef = useRef('')

  const handleUpdate = async () => {
    const updateUser = { name: nameRef.current.value, email: emailRef.current.value, roles: rolesRef.current.value, active: activeRef.current.value}
    const prevUser  = [nameRef.current.defaultValue, emailRef.current.defaultValue,  rolesRef.current.defaultValue, activeRef.current.defaultValue]
  
    Object.keys(updateUser).forEach(key => {
      if (validator.isEmpty(updateUser[key], { ignore_whitespace:true }) || prevUser.includes(updateUser[key])) {
        delete updateUser[key]
      }
    })
    
    if (!auth) {
      setError('You must be logged in')
      return
    }

    const checkChange = Object.keys(updateUser).length === 0

    if(!checkChange){
      try {
        const response = await axiosPrivate.patch('/api/users/' + user._id, updateUser)
        setError(null)
        setShow(false)
        dispatch({type: 'UPDATE_USER', payload: response.data})
      } catch (error) {
        setError(error.response?.data.error)
      }
    }else{
      setError("Nothing Changed")
    }
}
    
  return (
    <>
        <button className="btn btn-outline-primary mx-2 p-1" onClick={() => setShow(!show)}><BsPencilSquare className="fs-4"/></button>
        
        <Modal show={show} onHide={() => {setShow(!show);setError(null)}} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit User Record</Modal.Title>
            </Modal.Header> 
            <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Name:</Form.Label>
                  <Form.Control type="text" defaultValue={user.name} ref={nameRef} autoFocus/>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control type="text" defaultValue={user.email} ref={emailRef} autoFocus/>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Roles:</Form.Label>
                  <Form.Control type="text" defaultValue={user.roles} ref={rolesRef} autoFocus/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Label>Active:</Form.Label>
                  <Form.Check type="switch" defaultChecked={user.active} ref={activeRef}/>
                </Form.Group>
                {error && (<Alert variant={'danger'}>{error}</Alert>)}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleUpdate}>Save Changes </Button>
            </Modal.Footer>
        </Modal>
    </>
  )
}

export default Edit