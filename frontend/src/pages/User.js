import Details from '../components/users/Index'
import Add from '../components/users/Add'
import { useAuthContext } from '../hooks/useAuthContext'

const User = () => {
  const {auth} = useAuthContext()
  const admin =  auth && (auth.roles == "Admin")

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