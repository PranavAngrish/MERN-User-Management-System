import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ROLES } from '../../config/roles'
import { Alert, Button, Col, Form, Row, Stack } from "react-bootstrap"
import { useAuthContext } from '../../context/auth'
import { useUserContext } from '../../context/user'
import { usePathContext } from '../../context/path'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const Edit = () => {
  const navigate = useNavigate()
  const axiosPrivate = useAxiosPrivate()
  const { id } = useParams()
  const { auth } = useAuthContext()
  const { targetUser } =  useUserContext()
  const { setTitle } = usePathContext()
  const [ error, setError ] = useState(null)
  const [ note, setNote ] = useState(null)
  const titleRef = useRef('')
  const textRef = useRef('')

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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!auth) {
      setError('You must be logged in')
      return
    }
    
    try {
      const rughtToAdd = auth.roles == ROLES.Admin || auth.roles == ROLES.Root
      const updateNote = {title: titleRef.current.value, text: textRef.current.value}

      if(targetUser?.userId && (auth.email !== targetUser?.userEmail) && (rughtToAdd)){
        updateNote.id = targetUser.userId
      }

      await axiosPrivate.patch(`/api/notes/${note._id}`, updateNote)
      setError(null)
      navigate(`/note/view/${note._id}`)
    } catch (error) {
      // console.log(error)
      setError(error.response?.data.error)
    }
  }

  return (
    <>
      {note && (
        <>
          <h1 className="my-3">Edit Note</h1>
          
          <Form onSubmit={handleSubmit}>
            <Stack gap={4}>
              <Row>
                <Col>
                  <Form.Group controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control defaultValue={note.title} ref={titleRef}  />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlId="markdown">
                <Form.Label>Body</Form.Label>
                <Form.Control defaultValue={note.text} ref={textRef} as="textarea" rows={15}/>
              </Form.Group>
              {error && (<Alert variant={'danger'}>{error}</Alert>)}
              <Stack direction="horizontal" gap={2} className="justify-content-end">
                <Button type="submit" variant="primary">Save</Button>
                <Link to={`/note/view/${note._id}`}>
                  <Button type="button" variant="outline-secondary">Cancel</Button>
                </Link>
              </Stack>
            </Stack>
          </Form>
        </>
      )}
    </>
  )
}

export default Edit