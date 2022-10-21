import { createContext, useContext, useState } from 'react'

export const PathContext = createContext()

export const PathContextProvider = ({ children }) => {
    const [title, setTitle] = useState('Welcome')
    const [link, setLink] = useState('/')
    
    return (<PathContext.Provider value={{title, setTitle, link, setLink}}>{ children }</PathContext.Provider>)
}

export const usePathContext = () => useContext(PathContext)