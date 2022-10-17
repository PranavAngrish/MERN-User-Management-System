import { createContext, useContext, useState } from 'react'

export const TitleContext = createContext()

export const TitleContextProvider = ({ children }) => {
    const [title, setTitle] = useState('Welcome')
    return (<TitleContext.Provider value={{title, setTitle}}>{ children }</TitleContext.Provider>)
}

export const useTitleContext = () => useContext(TitleContext)