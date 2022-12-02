import { useEffect } from 'react'
import { useAuthContext } from '../context/auth'
import { useTasksContext } from '../context/task'
import { usePathContext } from '../context/path'
import { ROLES } from '../config/roles'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import Details from '../components/tasks/Index'
import Add from '../components/tasks/Add'

const Task = () => {
  const { auth } = useAuthContext()
  const { setTitle } = usePathContext()
  const { tasks, dispatch } =  useTasksContext()
  const axiosPrivate = useAxiosPrivate()
  const admin = (auth.roles == ROLES.Admin) || (auth.roles == ROLES.Root)

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
      } catch (err) {
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
          {tasks && <Details tasks={tasks}/>}
        </>
      )}
    </>
  )
}

export default Task