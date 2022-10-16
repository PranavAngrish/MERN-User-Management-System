import { useContext } from "react"
import { SleepsContext } from "../context/sleep"

export const useSleepsContext = () => {
  const context = useContext(SleepsContext)
  if(!context) throw Error('useSleepsContext must be used inside an SleepsContextProvider')
  return context
}