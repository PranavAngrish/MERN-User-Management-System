import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BiArrowBack } from 'react-icons/bi'
import { useAuthContext } from '../context/auth'
import { useTasksContext } from '../context/task'
import { usePathContext } from '../context/path'
import { ROLES } from '../config/roles'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import Details from '../components/tasks/Index'
import Add from '../components/tasks/Add'

const Task = () => {
  const navigate = useNavigate()
  const { auth } = useAuthContext()
  const { setTitle } = usePathContext()
  const { tasks, dispatch } =  useTasksContext()
  const [ error, setError ] = useState(null)
  const axiosPrivate = useAxiosPrivate()
  const roleToSrting = auth.roles.toString()
  const admin = (roleToSrting === ROLES.Admin) || (roleToSrting === ROLES.Root)

  const handleBack = () => {
    setTitle("Welcome")
    navigate("/")
  }

  useEffect(() => {
    setTitle("Task Management")
    let isMounted = true
    const abortController = new AbortController()

    const getAllTask = async () => {
      try {
        const response = await axiosPrivate.get('/api/tasks', {
          signal: abortController.signal
        })
        isMounted && dispatch({type: 'SET_TASKS', payload: response.data})
        setError(null)
      } catch (err) {
        dispatch({type: 'SET_TASKS', payload: []})
        setError(err.response?.data.error)
        // console.log(err)
      }
    }

    if(auth){
      getAllTask()
    }

    return () => {
      isMounted = false
      abortController.abort()
    }
  },[])

  return (
    <>
      {auth && (
        <>
          {admin && <Add />}
          {roleToSrting === ROLES.User && (
            <div className="d-flex justify-content-between">
              <button className="btn btn-outline-primary mb-2" onClick={handleBack}><BiArrowBack /></button>
            </div>
          )}
          {tasks && <Details tasks={tasks}/>}
          {error && !tasks?.length && <div className="error">{error}</div>}
        </>
      )}
    </>
  )
}

export default Task