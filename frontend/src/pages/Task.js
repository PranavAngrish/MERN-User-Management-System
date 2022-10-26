import { useEffect } from 'react'
import { ROLES } from '../config/roles'
import { useAuthContext } from '../hooks/useAuthContext'
import { usePathContext } from '../context/path'
import { AiOutlineSetting } from "react-icons/ai"
import { FaUserCircle } from "react-icons/fa"
import { FiMoreHorizontal } from "react-icons/fi"
import { HiLink, HiOutlineStar } from "react-icons/hi"
import { IoAddCircleOutline } from "react-icons/io5"
// import Details from '../components/tasks/Index'
// import Add from '../components/tasks/Add'

const Task = () => {
  const {auth} = useAuthContext()
  const { setTitle } = usePathContext()
  const admin =  auth && (auth.roles == ROLES.Admin)

  useEffect(() => {
    setTitle("Note Management")
  },[])

  return (
    <>
        <div className="container">
            <div className="card mt-5 border-5 pt-2 pb-0 px-3">
                <div className="card-body ">
                    <div className="row">
                        <div className="col-12 mb-2">
                            <h4 className="card-title"><b>Task Title</b></h4>
                        </div>
                        <div className="col">
                            <h6 className="card-subtitle mb-2 text-muted">
                            <p className="card-text text-muted small">
                                <HiOutlineStar className="mr-1" style={{ width:"22",height:"22"}}/>
                                <span className="vl"></span>
                                Created by <span className="font-weight-bold"> Blablabla Team</span> on 1 Nov , 2018
                            </p>
                            </h6>
                        </div>
                    </div>
                </div>
                <div className="card-footer bg-white px-0">
                    <div className="row">
                        <div className="col-md-auto">
                            <button className="btn btn-outlined text-muted">
                                <AiOutlineSetting style={{ width:"22",height:"22"}}/>
                                <small>&nbsp;SETTINGS</small>
                            </button>
                            <button className="btn btn-outlined text-muted">
                                <HiLink className="plus" style={{ width:"22",height:"22"}}/>
                                <small>&nbsp;PROGRAM LINK</small>
                            </button>
                            <button className="btn btn-outlined text-muted">
                                <FiMoreHorizontal className="mr-2 more" style={{ width:"22",height:"22"}}/>
                                <small>&nbsp;MORE</small>
                            </button>
                            <span className="vl"></span>
                        </div>
                        <div className="col-md-auto">
                            <ul className="list-inline">
                                <li className="list-inline-item">
                                    <FaUserCircle style={{ width:"32",height:"32"}}/>
                                </li>
                                <li className="list-inline-item"> 
                                    <IoAddCircleOutline className="more" style={{ width:"35",height:"35"}}/>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Task