import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import { Container, Nav, Navbar, Button } from "react-bootstrap"

const Navbars = () => {
  const { logout } = useLogout()
  const { user } = useAuthContext()

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/"><h3>Go Sleep Buddy!!!</h3></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              {user && (
                <>
                  <Navbar.Text>{user.name}</Navbar.Text>
                  <Button variant="outline-warning" className="mx-3" onClick={() => logout()}>Log Out</Button>
                </>
              )}
              {!user && (
                <>
                  <Nav.Link href="/login">Login</Nav.Link>
                  <Nav.Link href="/signup">Signup</Nav.Link>
                </>
              )}
              
            </Nav>
          </Navbar.Collapse>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navbars