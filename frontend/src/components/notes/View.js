import { useEffect } from 'react'
import { ROLES } from '../../config/roles'
import { BiArrowBack } from 'react-icons/bi'
import { BsPencilSquare, BsFillTrashFill } from 'react-icons/bs'
import { useNavigate, useParams } from "react-router-dom"
import { Button, Col, Row, Stack } from "react-bootstrap"
import { usePathContext } from '../../context/path'
import { useNoteContext } from '../../context/note'
import { useUserContext } from '../../hooks/useUserContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import ReactMarkdown from "react-markdown"
import axios from '../api/axios' 

const View = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { auth } = useAuthContext()
  const { setTitle } = usePathContext()
  const { targetUser } = useUserContext()
  const { notes, dispatch } = useNoteContext()
  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    let isMounted = true
    const abortController = new AbortController()
    setTitle("Note Management")
    if(!id) navigate('/not-found')

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
          response = await axiosPrivate.get(`/api/notes/${id}`, {
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

  const deleteNote = async () => {
    try {
      const response = await axios.delete(`/api/notes/${id}`)
      dispatch({ type: 'DELETE_NOTE', payload: response.data })
    } catch (error) {
      // console.log(error)
    }
  }

  return (
    <>
      {notes && (
        <>
          <Row className="align-items-center mb-4">
            <Col><h1>{notes.title}</h1></Col>
            <Col xs="auto">
              <Stack gap={2} direction="horizontal">
                <Button variant="primary" onClick={() => navigate(`/note/edit${id}`, {replace: true})}><BsPencilSquare /></Button>
                <Button variant="outline-danger" onClick={deleteNote}><BsFillTrashFill /></Button>
                <Button variant="outline-secondary" onClick={() => navigate('/note', {replace: true})}><BiArrowBack /></Button>
              </Stack>
            </Col>
          </Row>
          
          <ReactMarkdown>{notes.text}</ReactMarkdown>
        </>
      )}
    </>
  )
}

export default View