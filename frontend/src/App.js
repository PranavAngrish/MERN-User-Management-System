import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'
import { usePathContext } from './context/path'
import { ROLES } from './config/roles'
import PersistLogin from './components/PersistLogin'
import RequireAuth from './components/RequireRoles'
import RequireRoles from './components/RequireRolese'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'
import Status from './components/Status'
import NotFound from './pages/NotFound'
import Sleep from './pages/Sleep'
import Note from './pages/Note'
import User from './pages/User'

function App() {
  const { auth } = useAuthContext()
  const { link } = usePathContext()

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Status />
        
        <div className="container mt-3">
          <Routes>
            <Route path="/login" element={!auth ? <Login /> : <Navigate to={link} />} />
            <Route path="/signup" element={!auth ? <Signup /> : <Navigate to="/" />} />

            <Route element={<PersistLogin />}>
              <Route path="/" element={<Home />}/>

              <Route element={<RequireAuth />}>
                <Route element={<RequireRoles Roles={[...Object.values(ROLES)]} />}>
                  <Route path="/sleep" element={<Sleep />} />
                  <Route path="/note" element={<Note />} />
                </Route>

                <Route element={<RequireRoles Roles={[ROLES.Admin]} />}>
                  <Route path="/user" element={<User />} />
                </Route>
              </Route>
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App;