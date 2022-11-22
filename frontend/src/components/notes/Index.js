import { Badge, Button, Card, Col, Form, Modal, Row, Stack } from "react-bootstrap"
import { GoSearch } from "react-icons/go"
import { Link } from "react-router-dom"
import Add from '../components/notes/Add'

const Index = () => {
  return (
    <>
      <Row className="align-items-center mb-2">
        {/* <Col><h1>Notes</h1></Col> */}
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Add />
            {/* <Link to="/"><Button variant="primary">Create</Button></Link> */}
            {/* <Button variant="outline-secondary">Edit Tags</Button> */}
          </Stack>
        </Col>
      </Row>
      <Form>
        <Row className="mb-4">
          <Col>
            {/* <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" />
            </Form.Group> */}
            <div className="input-group mt-2 mb-3">
              <input type="search" className="form-control" placeholder="Search..."/>
              <button className="btn btn-outline-primary" type="button"><GoSearch/></button>
            </div>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default Index