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
            <Link to="/note/add"><Button variant="primary">Create</Button></Link>
            {/* <Button variant="outline-secondary">Edit Tags</Button> */}
          </Stack>
        </Col>
      </Row>
      
      {/* <div className="row">
        <div className="col-lg-3">
          <div className="card my-2">
              <div className="card-body">
                  <h5 className="card-title">Note</h5>
                  <p className="card-text">Tag</p>
                  <Link to="/note" onClick={() => handleClick("/")}><button className="btn btn-primary"><FaStickyNote/></button></Link>
              </div>
          </div>
        </div>
      </div> */}
    </>
  )
}

export default Index