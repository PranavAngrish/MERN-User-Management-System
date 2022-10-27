import { useEffect } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { useTasksContext } from '../hooks/useTasksContext'
import { usePathContext } from '../context/path'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import Details from '../components/tasks/Index'
import Add from '../components/tasks/Add'

const Task = () => {
  const { auth } = useAuthContext()
  const { setTitle } = usePathContext()
  const { tasks, dispatch } =  useTasksContext()
  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    setTitle("Task Management")
    let isMounted = true
    const abortController = new AbortController()

    const getAllTask = async () => {
      try {
        const response = await axiosPrivate.get('/api/tasks', {
          signal: abortController.signal
        })
        console.log(response.data)
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
          <Add />
          {tasks && <Details tasks={tasks}/>}
        </>
      )}
    </>
  )
}

export default Task