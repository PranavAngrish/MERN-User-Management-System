import { useEffect, useState } from 'react'
import { ROLES } from '../../config/roles'
import { BiArrowBack } from 'react-icons/bi'
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button, Col, Row, Stack } from "react-bootstrap"
import { BsPencilSquare, BsFillTrashFill } from 'react-icons/bs'
import { usePathContext } from '../../context/path'
import { useUserContext } from '../../hooks/useUserContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import ReactMarkdown from "react-markdown"

const View = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { auth } = useAuthContext()
  const { setTitle } = usePathContext()
  const { targetUser } = useUserContext()
  const [ note, setNote ] = useState()
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
        isMounted && setNote(response.data)
      } catch (err) {
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
      await axiosPrivate.delete(`/api/notes/${id}`)
      navigate('/note', {replace: true})
    } catch (error) {
      // console.log(error)
    }
  }

  return (
    <>
      {note && (
        <>
          <Row className="align-items-center mb-4">
            <Col><h1>{note.title}</h1></Col>
            <Col xs="auto">
              <Stack gap={2} direction="horizontal">
                <Link to={`/note/edit/${id}`}>
                  <Button variant="primary" onClick={() => navigate(`/note/edit/${id}`, {replace: true})}><BsPencilSquare /></Button>
                </Link>
                <Button variant="outline-danger" onClick={deleteNote}><BsFillTrashFill /></Button>
                <Link to="/note">
                  <Button variant="outline-secondary"><BiArrowBack /></Button>
                </Link>
              </Stack>
            </Col>
          </Row>
          
          <ReactMarkdown>{note.text}</ReactMarkdown>
        </>
      )}
    </>
  )
}

export default View