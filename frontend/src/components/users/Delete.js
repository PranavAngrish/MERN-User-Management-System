import React from 'react'
import { BsFillTrashFill } from 'react-icons/bs'
import { Modal } from 'react-bootstrap'

const Delete = () => {
  return (
    <>
      <button className="btn btn-outline-danger p-1"><BsFillTrashFill className="fs-4"/></button>
      
      {/* <Modal show={show} onHide={() => {setShow(!show);setError(null)}} centered>
          <Modal.Header closeButton>
              <Modal.Title>Error</Modal.Title>
          </Modal.Header> 
          <Modal.Body closeButton>
              <div className="alert alert-danger" role="alert">{error}dfgdfdf dfhdfhdfgh dffhgdfh </div>
          </Modal.Body>
      </Modal> */}
    </>
  )
}

export default Delete