import { useRef, useState } from 'react'
import { ROLES } from '../../config/roles'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, Col, Form, Row, Stack } from "react-bootstrap"
import { useAuthContext } from '../../hooks/useAuthContext'
import { useUserContext } from '../../hooks/useUserContext'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const Add = () => {
  const navigate = useNavigate()
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuthContext()
  const { targetUser } =  useUserContext()
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

      await axiosPrivate.post('/api/notes', note)
      setError(null)
      navigate('/note')
    } catch (error) {
      setError(error.response?.data.error)
      // console.log(error)
    }
  }
  
  return (
    <>
      <h1 className="my-3">New Note</h1>

      <Form onSubmit={handleSubmit}>
        <Stack gap={4}>
          <Row>
            <Col>
              <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control ref={titleRef} />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="markdown">
            <Form.Label>Body</Form.Label>
            <Form.Control as="textarea" ref={textRef} rows={15}/>
          </Form.Group>
          {error && (<Alert variant={'danger'}>{error}</Alert>)}
          <Stack direction="horizontal" gap={2} className="justify-content-end">
            <Button type="submit" variant="primary">Save</Button>
            <Link to="/note">
              <Button type="button" variant="outline-secondary">Cancel</Button>
            </Link>
          </Stack>
        </Stack>
      </Form>
    </>
  )
}

export default Add