import { useRef, useState } from 'react'
import { Alert, Button, Col, Form, Row, Stack } from "react-bootstrap"
import { useNotesContext } from '../../hooks/useNotesContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useUserContext } from '../../hooks/useUserContext'
import { Link } from 'react-router-dom'
import { ROLES } from '../../config/roles'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const Edit = ({ note }) => {
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuthContext()
  const { targetUser } =  useUserContext()
  const { dispatch } = useNotesContext()
  const [ error, setError ] = useState(null)
  const titleRef = useRef('')
  const textRef = useRef('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!auth) {
      setError('You must be logged in')
      return
    }
    
    try {
      const rughtToAdd = auth.roles == ROLES.Admin || auth.roles == ROLES.Root
      const note = {title: titleRef.current.value, text: textRef.current.value}

      if(targetUser?.userId && (auth.email !== targetUser?.userEmail) && (rughtToAdd)){
        note.id = targetUser.userId
      }

      const response = await axiosPrivate.patch(`/api/note/${note.id}`, note)
      setError(null)
      dispatch({type: 'CREATE_NOTE', payload: response.data})
    } catch (error) {
      // console.log(error)
      setError(error.response?.data.error)
    }
  }

  return (
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
            <Link to="..">
              <Button type="button" variant="outline-secondary">Cancel</Button>
            </Link>
          </Stack>
        </Stack>
      </Form>
    </>
  )
}

export default Edit