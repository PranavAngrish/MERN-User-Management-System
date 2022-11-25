import { Badge, Button, Card, Col, Form, Modal, Row, Stack } from "react-bootstrap"
import { GoSearch } from "react-icons/go"
import { Link } from "react-router-dom"

const Index = () => {
  return (
    <>
      <Row className="align-items-center mb-2">
        <Col><h1>Notes</h1></Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to="/"><Button variant="primary">Create</Button></Link>
            {/* <Button variant="outline-secondary">Edit Tags</Button> */}
          </Stack>
        </Col>
      </Row>
    </>
  )
}

export default Index