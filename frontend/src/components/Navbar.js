import { useLogout } from '../hooks/useLogout'
import { useTitleContext } from '../context/title'
import { useAuthContext } from '../hooks/useAuthContext'
import { Container, Nav, Navbar, Button } from "react-bootstrap"
import { Link } from "react-router-dom"

const Navbars = () => {
  const { logout } = useLogout()
  const { auth } = useAuthContext()
  const { title, setTitle } = useTitleContext()

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <div className="container-fluid">
        <Navbar.Brand><h3><Link to="/" className="text-decoration-none text-white" onClick={e => setTitle("Welcome")}>{title}</Link></h3></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              {auth && (<Button variant="outline-warning" className="mx-3" onClick={() => logout()}>Log Out</Button>)}
              {!auth && (
                <>
                  <Nav.Link href="/login">Login</Nav.Link>
                  <Nav.Link href="/signup">Signup</Nav.Link>
                </>
              )}
              
            </Nav>
          </Navbar.Collapse>
        </Navbar.Collapse>
      </div>
    </Navbar>
  )
}

export default Navbars