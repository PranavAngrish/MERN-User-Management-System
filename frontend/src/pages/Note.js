import { useEffect } from 'react'
import { ROLES } from '../config/roles'
import { GoSearch } from "react-icons/go"
import { BiArrowBack } from 'react-icons/bi'
import { BsPlusLg } from 'react-icons/bs'
import { Link, useNavigate } from "react-router-dom"
import { usePathContext } from '../context/path'
import { useUserContext } from '../hooks/useUserContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { useNoteContext } from '../../context/note'
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import Details from '../components/notes/Index'

const Note = () => {
  const navigate = useNavigate()
  const { setTitle } = usePathContext()
  const { auth } = useAuthContext()
  const { targetUser } = useUserContext()
  const { notes, dispatch } = useNoteContext()
  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    let isMounted = true
    const abortController = new AbortController()
    setTitle("Note Management")

    const getNoteList = async () => {
      try {
        let response
        if(targetUser?.userId && (auth.email !== targetUser.userEmail) && (auth.roles == ROLES.Admin)){
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
        isMounted && dispatch({type: 'SET_NOTE', payload: response.data})
      } catch (err) {
        dispatch({type: 'SET_NOTE', payload: []})
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

      <div className="row">
        {notes && notes.map(note => (
          <Details note={note} key={note._id} />
        ))}
      </div>
    </>
  )
}

export default Note