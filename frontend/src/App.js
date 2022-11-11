import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'
import { usePathContext } from './context/path'
import { ROLES } from './config/roles'
import PersistLogin from './components/PersistLogin'
import RequireAuth from './components/RequireAuth'
import RequireRoles from './components/RequireRoles'
import Recaptcha from './pages/Recaptcha'
import Signup from './pages/Signup'
import Activate from './pages/auth/Activate'
import Navbar from './components/Navbar'
import Status from './components/Status'
import Home from './pages/Home'
import Note from './pages/Note'
import Sleep from './pages/Sleep'
import Task from './pages/Task'
import User from './pages/User'
import Assign from './pages/Assign'
import NotFound from './pages/NotFound'

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
            <Route path="/login" element={!auth ? <Recaptcha /> : <Navigate to={link} />} />
            <Route path="/signup" element={!auth ? <Signup /> : <Navigate to="/" />} />
            <Route path="/activate/:activation_token" element={<Activate />} />

            <Route element={<PersistLogin />}>
              <Route path="/" element={<Home />}/>

              <Route element={<RequireAuth />}>
                <Route element={<RequireRoles Roles={[...Object.values(ROLES)]} />}>
                  <Route path="/sleep" element={<Sleep />} />
                  <Route path="/note" element={<Note />} />
                  <Route path="/task" element={<Task />} />
                </Route>

                <Route element={<RequireRoles Roles={[ROLES.Root, ROLES.Admin]} />}>
                  <Route path="/user" element={<User />} />
                  <Route path="/assign" element={<Assign />} />
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