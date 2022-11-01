import { useState } from 'react'
import { BsFillTrashFill } from 'react-icons/bs'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useTasksContext } from '../../../hooks/useTasksContext'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'

const Delete = ({ user_id }) => {
  const axiosPrivate = useAxiosPrivate()
  const { assignedUser, setAssignedUser } =  useTasksContext()
  const { auth } = useAuthContext()
  const [error, setError] = useState(null)
  const [show, setShow] = useState(false)

  const handleDelete = async () => {
    if(!auth) {
      setError('You must be logged in') 
      setShow(!show)
      return
    }

    try {
      const response = await axiosPrivate.delete(`/api/tasks/assign/${assignedUser._id}`, {data: {user_id: user_id}})
      setAssignedUser(response.data)
      setError(null)
      setShow(false)
    } catch (error) {
      // console.log(error)
      setError(error.response?.data.error)
    }
  }

  return (
    <button className="btn btn-outline-danger p-1" onClick={handleDelete}><BsFillTrashFill className="fs-4"/></button>
  )
}

export default Delete