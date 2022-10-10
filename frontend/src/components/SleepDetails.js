import { useRef, useState } from 'react'
import { useSleepsContext } from '../hooks/useSleepsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { Alert, Button, Form, Modal } from 'react-bootstrap'
import { BsFillTrashFill, BsPencilSquare } from "react-icons/bs"
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import useAxiosPrivate from "../hooks/useAxiosPrivate"
const validator = require('validator')

const SleepDetails = ({ sleep }) => {
  const axiosPrivate = useAxiosPrivate()
  const { dispatch } =  useSleepsContext()
  const { user } = useAuthContext()
  const titleRef = useRef('')
  const loadRef = useRef('')
  const repsRef = useRef('')
  const [error, setError] = useState(null)
  const [show, setShow] = useState(false)

  const handleDelete = async () => {
    if (!user) {
      setError('You must be logged in')
      return
    }

    try {
      const response = await axiosPrivate.delete('/api/sleeps/' + sleep._id)
      setError(null)
      dispatch({type: 'DELETE_SLEEP', payload: response.data})
    } catch (error) {
      setError(error.response?.data.error)
    }

    const response = await fetch('/api/sleeps/' + sleep._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.accessToken}`
      }
    })

    const json = await response.json()
    console.log(json)

    if (!response.ok) {
      setError(json.error)
    }

    if (response.ok) {
      setError(null)
      dispatch({type: 'DELETE_SLEEP', payload: json})
    }
  }

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
        <div className="card my-3">
          <div className="card-body d-flex justify-content-between align-items-start">
            <div>
              <div className="fs-4 mb-1 text-primary">{sleep.title}</div>
              <p>
                <strong className="fs-6 text-muted">Load (kg): </strong>{sleep.load}<br/>
                <strong className="fs-6 text-muted">Number of reps: </strong>{sleep.reps}<br/>
                {formatDistanceToNow(new Date(sleep.createdAt), { addSuffix: true })}
              </p>
            </div>
            <div>
              <button className="btn btn-sm btn-outline-primary rounded-circle mx-2 p-2" onClick={() => setShow(!show)}><BsPencilSquare className="fs-5"/></button>
              <button className="btn btn-outline-danger rounded-circle p-2" onClick={handleDelete}><BsFillTrashFill className="fs-5"/></button>
            </div>
          </div>
          <div className="mx-3">
            {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
          </div>
        </div>

        <Modal show={show} onHide={() => {setShow(!show);setError(null)}} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Sleep Record</Modal.Title>
          </Modal.Header> 
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Excersize Title:</Form.Label>
              <Form.Control type="text" placeholder={sleep.title} autoFocus ref={titleRef}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Load (in kg):</Form.Label>
              <Form.Control type="number" placeholder={sleep.load} autoFocus ref={loadRef}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Number of Reps:</Form.Label>
              <Form.Control type="number" placeholder={sleep.reps} autoFocus ref={repsRef}/>
            </Form.Group>
            {error && (<Alert variant={'danger'}>{error}</Alert>)}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleUpdate}> 
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }
  
  export default SleepDetails