import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

const Navbar = () => {
  const { logout } = useLogout()
  const { user } = useAuthContext()

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>Go Sleep Buddy!!!</h1>
        </Link>
        <nav>
          {user && (
            <>
              <span>{user.name}</span>
              <button onClick={() => logout()}>Log Out</button>
            </>
          )}
          {!user && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar