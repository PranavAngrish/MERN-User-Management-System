import { AiOutlineSetting } from "react-icons/ai"
import { BsCalendarWeek } from 'react-icons/bs'
import { BiTimer } from 'react-icons/bi'
import { FiMoreHorizontal } from "react-icons/fi"
import { HiLink, HiOutlineStar } from "react-icons/hi"
import { MdAdminPanelSettings } from "react-icons/md"
import { IoAddCircleOutline } from "react-icons/io5"
import { SiStatuspal } from "react-icons/si"
import { FaUserCircle } from "react-icons/fa"
import { Link } from 'react-router-dom'
import { ROLES } from '../../config/roles'
import { useAuthContext } from '../../hooks/useAuthContext'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import Delete from './Delete'
import Edit from './Edit'

const Index = ({ tasks }) => {
  const { auth } = useAuthContext()
  const admin = (auth.roles == ROLES.Admin) || (auth.roles == ROLES.Root)

  return (
    <>
      {tasks.map(task => (<div className="card mt-2 mb-3 border-5 pt-2 pb-0 px-3" key={task._id}>
        <div className="card-body">
            <div className="row">
                <div className="col-12 mb-2">
                    <h4 className="card-title"><b>{task.title}</b></h4>
                </div>
                <div className="col">
                  <h6 className="card-subtitle mb-2 text-muted">
                    <p className="card-text text-muted small">
                      <HiOutlineStar className="mr-1 fs-5"/>
                      <span className="vl"></span>
                      <MdAdminPanelSettings className="fs-4"/><span className="font-weight-bold">&nbsp;{task.createdBy.name}</span>
                      <span className="vl"></span>
                      <SiStatuspal className="fs-6"/><small>&ensp;{task.status}</small>
                      <span className="vl"></span>
                      <BsCalendarWeek className="fs-6"/><small>&ensp;{new Date(task.createdAt).toLocaleDateString('en-GB')}</small>
                      <span className="vl"></span>
                      <BiTimer className="fs-5"/><small>&ensp;{formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</small>
                    </p>
                  </h6>
                </div>
            </div>
            <div className="col">
              <p className="card-text">{task.description}</p>
            </div>
        </div>
        {admin && (
          <div className="card-footer bg-white px-0">
              <div className="row">
                <div className="col-md-auto">
                  <Edit task={task}/>
                  <Delete task={task}/>
                  <button className="btn btn-outlined text-muted taskbtn">
                    <AiOutlineSetting className="fs-5"/>
                    <small>&ensp;SETTINGS</small>
                  </button>
                  <button className="btn btn-outlined text-muted taskbtn">
                    <HiLink className="plus fs-5"/>
                    <small>&ensp;PROGRAM LINK</small>
                  </button>
                  <button className="btn btn-outlined text-muted taskbtn">
                    <FiMoreHorizontal className="more mr-2 fs-5"/>
                    <small>&ensp;MORE</small>
                  </button>
                  <span className="vl"></span>
                </div>
                <Link to="/assign" state={{title: task.title, createdBy: task.createdBy.name}}>
                  <div className="col-md-auto mt-1">
                    <ul className="list-inline">
                      <li className="list-inline-item"><FaUserCircle className="fs-3"/></li>
                      <li className="list-inline-item"><IoAddCircleOutline className="more fs-2"/></li>
                    </ul>
                  </div>
                </Link>
              </div>
          </div>
        )}
      </div>))}
    </>
  )
}

export default Index