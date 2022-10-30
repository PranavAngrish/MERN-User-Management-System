import { useState } from 'react'
import { BsPlusLg } from 'react-icons/bs'
import { Modal, Button } from 'react-bootstrap'

const Add = () => {
  const [show, setShow] = useState(false)

  const handleAssign = async () => {

  }

  return (
    <>
      <button className="btn btn-outline-primary mb-2" onClick={() => setShow(!show)}><BsPlusLg /></button>

      <Modal show={show} onHide={() => {setShow(!show)}} centered>
      <Modal.Header closeButton>
        <Modal.Title className="d-inline-flex align-items-center">Assign User</Modal.Title>
      </Modal.Header> 
      <Modal.Body>
      <select className="form-select" multiple size="5" aria-label="multiple select example">
        <option value=""></option>
      </select>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleAssign}>Assign</Button>
      </Modal.Footer>
    </Modal>
  </>
  )
}

export default Add