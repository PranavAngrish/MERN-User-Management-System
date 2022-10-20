import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'
import { ROLES } from './config/roles'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'
import Status from './components/Status'
import NotFound from './pages/NotFound'
import User from './pages/User'
import Sleep from './pages/Sleep'
import Note from './pages/Note'
import PersistLogin from './components/PersistLogin'
import CheckLogin from './components/CheckLogin'
import RequireAuth from './components/RequireAuth'

function App() {
  const { auth } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Status />
        
        <div className="container mt-3">
          <Routes>
            <Route path="/login" element={!auth ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!auth ? <Signup /> : <Navigate to="/" />} />

            <Route element={<PersistLogin />}>
              <Route path="/" element={<Home />}/>

              <Route element={<CheckLogin />}>
                <Route element={<RequireAuth Roles={[...Object.values(ROLES)]} />}>
                  <Route path="/sleep" element={<Sleep />} />
                  <Route path="/note" element={<Note />} />
                </Route>

                <Route element={<RequireAuth Roles={[ROLES.Admin]} />}>
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