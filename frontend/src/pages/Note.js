import { useEffect, useMemo, useState } from 'react'
import { ROLES } from '../config/roles'
import { GoSearch } from "react-icons/go"
import { BiArrowBack } from 'react-icons/bi'
import { FaAddressCard, FaTags } from "react-icons/fa"
import { BsFillPersonFill, BsPlusLg, BsPencilSquare } from "react-icons/bs"
import { Link } from "react-router-dom"
import { useNavigate } from 'react-router-dom'
import { usePathContext } from '../context/path'
import { useUserContext } from '../context/user'
import { useAuthContext } from '../context/auth'
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import Details from '../components/notes/Index'
import Edit from '../components/notes/tag/Edit'

const Note = () => {
  const navigate = useNavigate()
  const { setTitle } = usePathContext()
  const { auth } = useAuthContext()
  const { targetUser } = useUserContext()
  const [ notes, setNotes ] = useState()
  const [ query, setQuery ] = useState("")
  const [ notFound, setNotFound ] = useState(false)
  const axiosPrivate = useAxiosPrivate()
  const admin = (auth.roles == ROLES.Admin) || (auth.roles == ROLES.Root)

  const statusBar = {
    Root: "bg-danger",
    Admin: "bg-warning",
    User: "bg-primary"
  }
  const color = statusBar[targetUser?.userRoles]

  useEffect(() => {
    let isMounted = true
    const abortController = new AbortController()
    setTitle("Note Management")

    const getNoteList = async () => {
      try {
        let response
        if(targetUser?.userId && (auth.email !== targetUser.userEmail) && admin){
          // Admin view
          response = await axiosPrivate.post('/api/notes/admin', {
            id: targetUser.userId,
            signal: abortController.signal
          })
        }else{
          response = await axiosPrivate.get('/api/notes', {
            signal: abortController.signal
          })
        }
        isMounted && setNotes(response.data)
      } catch (err) {
        setNotes()
        setNotFound(true)
        // console.log(err)
      }
    }

    if(auth){
      getNoteList()
    }

    return () => {
      isMounted = false
      abortController.abort()
    }
  },[])

  const filteredNote = useMemo(() => {
    return notes?.filter(note => {
      return note.title.toLowerCase().includes(query.toLowerCase())
    })
  }, [notes, query])

  const handleBack = () => {
    setTitle("Welcome")
    navigate("/")
  }
  
  return (
    <>
      {targetUser?.userName && notes && (<div className={`${color} bg-opacity-25 rounded pt-2 mb-3`}>
        <span className="mx-3 d-inline-flex align-items-center"><FaAddressCard className="fs-4"/>&ensp;{targetUser?.userName}</span>
        <span className="d-inline-flex align-items-center"><BsFillPersonFill className="fs-4"/>&ensp;{targetUser?.userRoles}</span>
      </div>)}

      <div className="d-flex justify-content-between">
        <button className="btn btn-outline-primary mb-2" onClick={handleBack}><BiArrowBack /></button>
        <div>
          <Link to="/note/add">
            <button className="btn btn-outline-primary mb-2"><BsPlusLg /></button>
          </Link>
          <Edit />
        </div>
      </div>

      <div className="input-group mt-2 mb-3">
        <input type="search" className="form-control" placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)}/>
        <button className="btn btn-outline-primary" type="button"><GoSearch/></button>
      </div>
      
      <div className="row">
        {notes && <Details filteredNote={filteredNote}/>}
        {!filteredNote?.length && query && <div>No matching results found...</div>}
      </div>

      {notFound && !query && !notes?.length && (<div>No Record Found...</div>)}
    </>
  )
}

export default Note