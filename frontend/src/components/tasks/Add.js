import { useRef, useState } from 'react'
import { Alert, Button, Form, Modal } from 'react-bootstrap'
import { useTasksContext } from '../../hooks/useTasksContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import { BsPlusLg } from 'react-icons/bs'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const Add = () => {
  const axiosPrivate = useAxiosPrivate()
  const { dispatch } =  useTasksContext()
  const { auth } = useAuthContext()
  const [error, setError] = useState(null)
  const [show, setShow] = useState(false)
  const titleRef = useRef('')
  const descriptionRef = useRef('')

  const handleAdd = async () => {
    if (!auth) {
      setError('You must be logged in')
      return
    }
   
    try {
      const response = await axiosPrivate.post('/api/tasks', {
        title: titleRef.current.value,
        description: descriptionRef.current.value
      })
      dispatch({type: 'CREATE_TASK', payload: response.data})
      setError(null)
      setShow(false)
    } catch (error) {
      // console.log(error)
      setError(error.response?.data.error)
    }
  }

  return (
    <>
      <button className="btn btn-outline-primary mb-2" onClick={() => setShow(!show)}><BsPlusLg /></button>

      <Modal show={show} onHide={() => {setShow(!show);setError(null)}} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Task</Modal.Title>
        </Modal.Header> 
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title:</Form.Label>
            <Form.Control type="text" ref={titleRef}/>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description:</Form.Label>
            <Form.Control type="text" ref={descriptionRef}/>
          </Form.Group>
          {error && (<Alert variant={'danger'}>{error}</Alert>)}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleAdd}>Add Task</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Add