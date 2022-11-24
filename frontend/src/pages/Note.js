import { useEffect } from 'react'
import { GoSearch } from "react-icons/go"
import { BiArrowBack } from 'react-icons/bi'
import { BsPlusLg } from 'react-icons/bs'
import { Link, useNavigate } from "react-router-dom"
import { usePathContext } from '../context/path'
import Details from '../components/notes/Index'
import Add from '../components/notes/Add'

const Note = () => {
  const { setTitle } = usePathContext()
  const navigate = useNavigate()

  useEffect(() => {
    setTitle("Note Management")
  },[])
  
  return (
    <>
      <div className="d-flex justify-content-between">
        <button className="btn btn-outline-primary mb-2" onClick={() => navigate('/note', {replace: true})}><BiArrowBack /></button>
        <button className="btn btn-outline-primary mb-2" onClick={() => navigate('/note/add')}><BsPlusLg /></button>
      </div>

      <div className="input-group mt-2 mb-3">
        <input type="search" className="form-control" placeholder="Search..."/>
        <button className="btn btn-outline-primary" type="button"><GoSearch/></button>
      </div>

      <Details/>
    </>
  )
}

export default Note