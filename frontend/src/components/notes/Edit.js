import React from 'react'
import { Button, Col, Form, Row, Stack } from "react-bootstrap"
import { Link } from "react-router-dom"

const Edit = () => {
  const handleSubmit = () => {}

  return (
    <>
      <h1 className="my-3">Edit Note</h1>
      
      <Form onSubmit={handleSubmit}>
        <Stack gap={4}>
          <Row>
            <Col>
              <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control 
                // ref={titleRef} 
                required 
                // defaultValue={title} 
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="markdown">
            <Form.Label>Body</Form.Label>
            <Form.Control
              // defaultValue={markdown}
              required
              as="textarea"
              // ref={markdownRef}
              rows={15}
            />
          </Form.Group>
          <Stack direction="horizontal" gap={2} className="justify-content-end">
            <Button type="submit" variant="primary">
              Save
            </Button>
            <Link to="..">
              <Button type="button" variant="outline-secondary">
                Cancel
              </Button>
            </Link>
          </Stack>
        </Stack>
      </Form>
    </>
  )
}

export default Edit