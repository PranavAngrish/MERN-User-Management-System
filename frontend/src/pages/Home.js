import { Link } from 'react-router-dom'
import { ROLES } from '../config/roles'
import { usePathContext } from '../context/path'
import { useAuthContext } from '../hooks/useAuthContext'
import { useUserContext } from '../hooks/useUserContext'
import { GiNightSleep } from 'react-icons/gi'
import { FaUserFriends, FaTasks, FaStickyNote } from 'react-icons/fa'
import { MdAccountCircle } from "react-icons/md"

const Home = () => {
    const { auth } = useAuthContext()
    const { setLink } = usePathContext()
    const { setTargetUser } = useUserContext()

    const handleClick = (title) => {
        setLink(title)
        setTargetUser()
    }
    
    return (
        <>
            <div className="row">
                <div className="col-lg-3">
                    <div className="card my-2">
                        <div className="card-body">
                            <h5 className="card-title">Account Management</h5>
                            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                            <Link to="/account" onClick={() => handleClick("/account")}><button className="btn btn-primary"><MdAccountCircle/></button></Link>
                        </div>
                    </div>
                </div>
                {auth?.roles == ROLES.Admin && (<div className="col-lg-3">
                    <div className="card my-2">
                        <div className="card-body">
                            <h5 className="card-title">User Management</h5>
                            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                            <Link to="/user" onClick={() => handleClick("/user")}><button className="btn btn-primary"><FaUserFriends/></button></Link>
                        </div>
                    </div>
                </div>)}
                <div className="col-lg-3">
                    <div className="card my-2">
                        <div className="card-body">
                            <h5 className="card-title">Task Management</h5>
                            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                            <Link to="/task" onClick={() => handleClick("/task")}><button className="btn btn-primary"><FaTasks/></button></Link>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3">
                    <div className="card my-2">
                        <div className="card-body">
                            <h5 className="card-title">Sleep Management</h5>
                            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                            <Link to="/sleep" onClick={() => handleClick("/sleep")}><button className="btn btn-primary"><GiNightSleep/></button></Link>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3">
                    <div className="card my-2">
                        <div className="card-body">
                            <h5 className="card-title">Note Management</h5>
                            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                            <Link to="/note" onClick={() => handleClick("/note")}><button className="btn btn-primary"><FaStickyNote/></button></Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home