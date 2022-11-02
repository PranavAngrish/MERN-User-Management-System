import { useRef, useEffect, useState } from 'react'
import { BsPlusLg } from 'react-icons/bs'
import { Modal, Button } from 'react-bootstrap'
import { useTasksContext } from '../../../hooks/useTasksContext'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'

const Add = ({ task_id }) => {
  const axiosPrivate = useAxiosPrivate()
  const { setAssignedUser } =  useTasksContext()
  const [notAssignedUser, setNotAssignedUser] = useState([])
  const [show, setShow] = useState(false)
  const [error, setError] = useState(null)
  const nameRef = useRef()

  const handleClick = async () => {
    setShow(!show)

    try {
      const response = await axiosPrivate.get(`/api/users/unassigned/${task_id}`)
      setNotAssignedUser(response.data)
      setError(null)
      if(response.data.length === 0) setError("No idle users found")
    } catch (err) {
      // console.log(err)
      setError(err.response.data.error)
    }
  }

  const handleAssign = async () => {
    const seletedUser = Array.from(nameRef.current.selectedOptions, option => option.value)
    if(seletedUser.length === 0){
      setShow(true)
      setError("No user seleted")
      return
    }

    try {
      const response = await axiosPrivate.post('/api/tasks/assign', {
        task_id: task_id,
        user_id: seletedUser
      }) 
      setAssignedUser(response.data)
      setError(null)
      setShow(false)
    } catch (error) {
      // console.log(error)
      setError(error.response.data.error)
    }
  }

  return (
    <>
      <button className="btn btn-outline-primary mb-2" onClick={handleClick}><BsPlusLg /></button>

      <Modal show={show} onHide={() => {setShow(!show)}} centered>
        <Modal.Header closeButton>
          <Modal.Title className="d-inline-flex align-items-center">Assign User</Modal.Title>
        </Modal.Header> 
        <Modal.Body>
          {!(notAssignedUser.length === 0) && (<select className="form-select" multiple size="5" aria-label="multiple select user" ref={nameRef}>
            {notAssignedUser.map((n, index) => (
              <option value={n._id} key={index}>{n.name}</option>
            ))}
          </select>)}
          {error && (<div className="alert alert-danger mt-3" role="alert">{error}</div>)}
        </Modal.Body>
        {!(notAssignedUser.length === 0) && (<Modal.Footer>
          <Button variant="primary" onClick={handleAssign}>Assign</Button>
        </Modal.Footer>)}
      </Modal>  
  </>
  )
}

export default Add