import { useRef, useState } from 'react'
import { BsPencilSquare } from "react-icons/bs"
import { Alert, Button, Form, Modal } from 'react-bootstrap'
import { useSleepsContext } from '../../hooks/useSleepsContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
const validator = require('validator')

const Edit = ({sleep}) => {
    const axiosPrivate = useAxiosPrivate()
    const { dispatch } =  useSleepsContext()
    const { user } = useAuthContext()
    const [error, setError] = useState(null)
    const [show, setShow] = useState(false)
    const titleRef = useRef('')
    const loadRef = useRef('')
    const repsRef = useRef('')

    const handleUpdate = async () => {
        const updatesleep = { title: titleRef.current.value, load: loadRef.current.value, reps: repsRef.current.value }
        const prevSleep  = [titleRef.current.placeholder, loadRef.current.placeholder,  repsRef.current.placeholder]
      
        Object.keys(updatesleep).forEach(key => {
          if (validator.isEmpty(updatesleep[key], { ignore_whitespace:true }) || prevSleep.includes(updatesleep[key])) {
            delete updatesleep[key]
          }
        })
        
        if (!user) {
          setError('You must be logged in')
          return
        }
    
        const checkChange = Object.keys(updatesleep).length === 0
    
        if(!checkChange){
          try {
            const response = await axiosPrivate.patch('/api/sleeps/' + sleep._id, updatesleep)
            setError(null)
            setShow(false)
            dispatch({type: 'UPDATE_SLEEP', payload: response.data})
          } catch (error) {
            setError(error.response?.data.error)
          }
        }else{
          setError("Nothing Changed")
        }
    }
    
  return (
    <>
        <button className="btn btn-sm btn-outline-primary rounded-circle mx-2 p-2" onClick={() => setShow(!show)}><BsPencilSquare className="fs-5"/></button>
        
        <Modal show={show} onHide={() => {setShow(!show);setError(null)}} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Sleep Record</Modal.Title>
            </Modal.Header> 
            <Modal.Body>
                <Form.Group className="mb-3">
                    <Form.Label>Excersize Title:</Form.Label>
                    <Form.Control type="text" defaultValue={sleep.title} ref={titleRef} autoFocus/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Load (in kg):</Form.Label>
                    <Form.Control type="number" defaultValue={sleep.load} ref={loadRef} autoFocus/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Number of Reps:</Form.Label>
                    <Form.Control type="number" defaultValue={sleep.reps} ref={repsRef} autoFocus/>
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