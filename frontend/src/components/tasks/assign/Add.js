import { useRef, useEffect, useState } from 'react'
import { BsPlusLg } from 'react-icons/bs'
import { Modal, Button } from 'react-bootstrap'
import { useTasksContext } from '../../../hooks/useTasksContext'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'

const Add = ({ task_id }) => {
  const [show, setShow] = useState(false)
  const { setAssignedUser } =  useTasksContext()
  const [notAssignedUser, setNotAssignedUser] = useState([])
  const axiosPrivate = useAxiosPrivate()
  const nameRef = useRef()

  const handleClick = async () => {
    setShow(!show)

    try {
      const response = await axiosPrivate.get(`/api/users/unassigned/${task_id}`)
      setNotAssignedUser(response.data)
    } catch (err) {
      // console.log(err)
    }

  }

  const handleAssign = async () => {
    const seletedUser = Array.from(nameRef.current.selectedOptions, option => option.value)

    try {
      const response = await axiosPrivate.post('/api/tasks/assign', {
        task_id: task_id,
        user_id: seletedUser
      }) 
      setAssignedUser(response.data)
      setShow(false)
    } catch (error) {
      // console.log(error)
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
      <select className="form-select" multiple size="5" aria-label="multiple select user" ref={nameRef}>
        {notAssignedUser.map((n, index) => (
          <option value={n._id} key={index}>{n.name}</option>
        ))}
      </select>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleAssign}>Assign</Button>
      </Modal.Footer>
    </Modal>
  </>
  )
}

export default Add