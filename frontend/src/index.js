import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App'
import { TitleContextProvider } from './context/title'
import { AuthContextProvider } from './context/auth'
import { UserContextProvider } from './context/user'
import { SleepsContextProvider } from './context/sleep'
import { disableReactDevTools } from '@fvilers/disable-react-devtools'

if (process.env.NODE_ENV === 'production') disableReactDevTools()

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <TitleContextProvider>
      <AuthContextProvider>
        <UserContextProvider>
          <SleepsContextProvider>
            <App />
          </SleepsContextProvider>
        </UserContextProvider>
      </AuthContextProvider>
    </TitleContextProvider>
  </React.StrictMode>
)