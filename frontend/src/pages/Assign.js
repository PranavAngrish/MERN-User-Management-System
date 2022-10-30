import { useEffect, useState } from 'react'
import { ROLES } from '../config/roles'
import { usePathContext } from '../context/path'
import { useAuthContext } from '../hooks/useAuthContext'
import { FaTasks } from 'react-icons/fa'
import { MdAdminPanelSettings } from "react-icons/md"
import { useLocation } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import Details from '../components/tasks/assign/Index'
import Add from '../components/tasks/assign/Add'

const Assgin = ({ tasks }) => {
  const { auth } = useAuthContext()
  const { setTitle } = usePathContext()
  const [assignedUser, setAssignedUser] = useState([])
  const axiosPrivate = useAxiosPrivate()
  const location = useLocation()
  const { title, createdBy } = location.state ?? ""
  const roles = (auth.roles == ROLES.Admin) || (auth.roles == ROLES.Root)
  const admin =  auth && roles

  useEffect(() => {
    setTitle("Assign User")
    let isMounted = true
    const abortController = new AbortController()

    const getAllUser = async () => {
      try {
        const response = await axiosPrivate.get('/api/users/name')
        console.log(response.data)
        isMounted && setAssignedUser(response.data)
      } catch (err) {
        // console.log(err)
      }
    }

    if(auth){
      getAllUser()
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
        <Add />

        <div className="bg-success bg-opacity-25 rounded pt-2">
          <span className="mx-3 d-inline-flex align-items-center"><FaTasks className="fs-4"/>&ensp;{title}</span>
          <span className="d-inline-flex align-items-center"><MdAdminPanelSettings className="fs-4"/>&ensp;{createdBy}</span>
        </div>

          {assignedUser && (
            <table className="table mt-2">
              <thead className="table-light">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                <Details assignedUser={assignedUser}/>
              </tbody>
            </table>
          )}
        </>
      )}
    </>
  )
}

export default Assgin