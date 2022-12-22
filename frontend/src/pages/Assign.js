import { useEffect, useState } from 'react'
import { ROLES } from '../config/roles'
import { usePathContext } from '../context/path'
import { useAuthContext } from '../context/auth'
import { useTasksContext } from '../context/task'
import { FaTasks } from 'react-icons/fa'
import { GoSearch } from "react-icons/go"
import { MdAdminPanelSettings } from "react-icons/md"
import { useLocation } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import Details from '../components/tasks/assign/Index'
import Add from '../components/tasks/assign/Add'

const Assgin = () => {
  const [ query, setQuery ] = useState("")
  const { auth } = useAuthContext()
  const { setTitle } = usePathContext()
  const { assignedUser, setAssignedUser } =  useTasksContext()
  const axiosPrivate = useAxiosPrivate()
  const location = useLocation()
  const { id, title, createdBy } = location.state ?? ""
  const roles = (auth.roles == ROLES.Admin) || (auth.roles == ROLES.Root)
  const admin =  auth && roles

  useEffect(() => {
    setTitle("Assign User")
    let isMounted = true
    const abortController = new AbortController()

    const getAssignedUser = async () => {
      try {
        const response = await axiosPrivate.get(`/api/tasks/assign/${id}`)
        isMounted && setAssignedUser(response.data)
      } catch (err) {
        // console.log(err)
      }
    }

    if(auth){
      getAssignedUser()
    }

    return () => {
      isMounted = false
      abortController.abort()
    }
  },[])

  return (
    <>
      {admin && (
      <>
        <Add task_id={id}/>

        <div className="bg-success bg-opacity-25 rounded pt-2">
          <span className="mx-3 d-inline-flex align-items-center"><FaTasks className="fs-4"/>&ensp;{title}</span>
          <span className="d-inline-flex align-items-center"><MdAdminPanelSettings className="fs-4"/>&ensp;{createdBy.name}</span>
        </div>

        <div className="input-group my-3">
          <input type="search" className="form-control" placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)}/>
          <button className="btn btn-outline-primary" type="button"><GoSearch/></button>
        </div>

          {(assignedUser?.assignedTo?.length > 0) && (
            <table className="table mt-2">
              <thead className="table-light">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                <Details/>
              </tbody>
            </table>
          )}
        </>
      )}
    </>
  )
}

export default Assgin