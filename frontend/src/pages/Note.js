import { useEffect } from 'react'
import { GoSearch } from "react-icons/go"
import { usePathContext } from '../context/path'
import Details from '../components/notes/Index'
import Add from '../components/notes/Add'

const Note = () => {
  const { setTitle } = usePathContext()

  useEffect(() => {
    setTitle("Note Management")
  },[])
  
  return (
    <>
      <Add />

      <div className="input-group mt-2 mb-3">
        <input type="search" className="form-control" placeholder="Search..."/>
        <button className="btn btn-outline-primary" type="button"><GoSearch/></button>
      </div>

      <Details/>
    </>
  )
}

export default Note