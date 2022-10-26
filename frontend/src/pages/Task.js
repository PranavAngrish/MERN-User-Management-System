import { useEffect } from 'react'
import { ROLES } from '../config/roles'
import { useAuthContext } from '../hooks/useAuthContext'
import { usePathContext } from '../context/path'
import Details from '../components/tasks/Index'
import Add from '../components/tasks/Add'

const Task = () => {
  const {auth} = useAuthContext()
  const { setTitle } = usePathContext()
  const admin =  auth && (auth.roles == ROLES.Admin)

  useEffect(() => {
    setTitle("Task Management")
  },[])

  return (
    <>
        <Add />
        <Details/>
    </>
  )
}

export default Task