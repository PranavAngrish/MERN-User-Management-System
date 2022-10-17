import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'
import NotFound from './pages/NotFound'
import User from './pages/User'
import Sleep from './pages/Sleep'
import Note from './pages/Note'
import PersistLogin from './components/PersistLogin'

function App() {
  const { auth } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/login" element={!auth ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!auth ? <Signup /> : <Navigate to="/" />} />

            <Route element={<PersistLogin />}>
              <Route path="/user" element={auth ? <User /> : <Navigate to="/login" />} />
              <Route path="/sleep" element={auth ? <Sleep /> : <Navigate to="/login" />} />
              <Route path="/note" element={auth ? <Note /> : <Navigate to="/login" />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App;