import { Badge, Button, Card, Col, Form, Modal, Row, Stack } from "react-bootstrap"
import { FaUserFriends, FaTasks, FaStickyNote, FaUserCog } from 'react-icons/fa'
import { GoSearch } from "react-icons/go"
import { Link } from "react-router-dom"

const Index = ({ note }) => {
  return (
    <Link to={`/note/view/${note.id}`}>
      <div className="col-lg-3">
        <div className="card my-2">
          <div className="card-body">
            <h5 className="card-title">{note.title}</h5>
            {/* <p className="card-text">Tag</p> */}
            <Link to="/note"><button className="btn btn-primary"><FaStickyNote/></button></Link>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Index