import { createContext, useReducer, useContext } from 'react'

export const NotesContext = createContext()

export const notesReducer = (state, action) => {
    switch (action.type) {
      case 'SET_NOTE':
        return { notes: action.payload }
      case 'CREATE_NOTE':
        return { notes: [action.payload, ...state.notes] }
      case 'UPDATE_NOTE':
        return { notes: action.payload }
      case 'DELETE_NOTE':
        return { notes: state.notes.filter(n => n._id !== action.payload._id) }
      default:
        return state
    }
}

export const NotesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, { notes: null })
  return (<NotesContext.Provider value={{ ...state, dispatch }}>{ children }</NotesContext.Provider>)
}

export const useNoteContext = () => {
  const context = useContext(NotesContext)
  if(!context) throw Error('useNoteContext must be used inside an NotesContextProvider')
  return context
}