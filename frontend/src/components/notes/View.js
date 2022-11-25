import { Button, Col, Row, Stack } from "react-bootstrap"
import { Link } from "react-router-dom"

const View = () => {
  return (
    <>
      <Row className="align-items-center mb-4">
        <Col><h1>title</h1></Col>
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
    </>
  )
}

export default View