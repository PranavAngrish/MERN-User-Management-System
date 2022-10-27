import { useEffect } from 'react'
import { ROLES } from '../config/roles'
import { useAuthContext } from '../hooks/useAuthContext'
import { useUserContext } from '../hooks/useUserContext'
import { usePathContext } from '../context/path'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import Details from '../components/users/Index'
import Add from '../components/users/Add'

const User = () => {
  const { auth } = useAuthContext()
  const { setTitle } = usePathContext()
  const { users, dispatch } = useUserContext()
  const axiosPrivate = useAxiosPrivate()
  const roles = (auth.roles == ROLES.Admin) || (auth.roles == ROLES.Root)
  const admin =  auth && roles

  useEffect(() => {
    setTitle("User Management")
    let isMounted = true
    const abortController = new AbortController()

    const getAllUser = async () => {
      try {
        const response = await axiosPrivate.get('/api/users', {
          signal: abortController.signal
        })
        isMounted && dispatch({type: 'SET_USER', payload: response.data})
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

          {users && (
            <table className="table mt-2">
              <thead className="table-light">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Roles</th>
                  <th scope="col">Active</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                <Details users={users}/>
              </tbody>
            </table>
          )}
        </>
      )}
    </>
  )
}

export default User