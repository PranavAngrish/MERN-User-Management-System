import { useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { Button, Col, Row, Stack } from "react-bootstrap"
import { usePathContext } from '../context/path'
import { useUserContext } from '../hooks/useUserContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { useNoteContext } from '../../context/note'
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import ReactMarkdown from "react-markdown"

const View = () => {
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
      <Row className="align-items-center mb-4">
        <Col><h1>{note.title}</h1></Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to="/note/edit">
              <Button variant="primary">Edit</Button>
            </Link>
            <Button variant="outline-danger">Delete</Button>
            <Link to="/note">
              <Button variant="outline-secondary">Back</Button>
            </Link>
          </Stack>
        </Col>
      </Row>
      <ReactMarkdown>{note.body}</ReactMarkdown>
    </>
  )
}

export default View