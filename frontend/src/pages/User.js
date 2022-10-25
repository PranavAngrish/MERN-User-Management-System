import { useEffect } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { usePathContext } from '../context/path'
import Details from '../components/users/Index'
import Add from '../components/users/Add'

const User = () => {
  const {auth} = useAuthContext()
  const { setTitle } = usePathContext()
  const admin =  auth && (auth.roles == "Admin")

  useEffect(() => {
    setTitle("User Management")
  },[])

  return (
    <>
      {admin && (
        <>
          <Add />
          <Details/>
        </>
      )}
    </>
  )
}

export default User