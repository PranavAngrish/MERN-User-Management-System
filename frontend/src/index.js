import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App'
import { AuthContextProvider } from './context/auth'
import { SleepsContextProvider } from './context/sleep'
import { UserContextProvider } from './context/user'
import { disableReactDevTools } from '@fvilers/disable-react-devtools'

if (process.env.NODE_ENV === 'production') disableReactDevTools()

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <UserContextProvider>
        <SleepsContextProvider>
          <App />
        </SleepsContextProvider>
      </UserContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
)