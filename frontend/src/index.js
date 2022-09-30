import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { AuthContextProvider } from './context/auth'
import { SleepsContextProvider } from './context/sleep'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <SleepsContextProvider>
        <App />
      </SleepsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
)