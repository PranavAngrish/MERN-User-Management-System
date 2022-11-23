import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App'
import { PathContextProvider } from './context/path'
import { AuthContextProvider } from './context/auth'
import { UserContextProvider } from './context/user'
import { TasksContextProvider } from './context/task'
import { SleepsContextProvider } from './context/sleep'
import { NotesContextProvider } from './context/note'
import { disableReactDevTools } from '@fvilers/disable-react-devtools'

if (process.env.NODE_ENV === 'production') disableReactDevTools()

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <PathContextProvider>
      <AuthContextProvider>
        <UserContextProvider>
          <TasksContextProvider>
            <SleepsContextProvider>
              <NotesContextProvider>
                <App />
              </NotesContextProvider>
            </SleepsContextProvider>
          </TasksContextProvider>
        </UserContextProvider>
      </AuthContextProvider>
    </PathContextProvider>
  </React.StrictMode>
)