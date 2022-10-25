import { Link } from 'react-router-dom'
import { ROLES } from '../config/roles'
import { usePathContext } from '../context/path'
import { useAuthContext } from '../hooks/useAuthContext'
import { useUserContext } from '../hooks/useUserContext'
import { GiNightSleep } from 'react-icons/gi'
import { FaUserFriends, FaTasks, FaStickyNote } from 'react-icons/fa'

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
                {auth?.roles == ROLES.Admin && (<div className="col-sm-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">User Management</h5>
                            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                            {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}
                            <Link to="/user" onClick={() => handleClick("/user")}><button className="btn btn-primary"><FaUserFriends/></button></Link>
                        </div>
                    </div>
                </div>)}
                <div className="col-sm-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Sleep Management</h5>
                            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                            <Link to="/sleep" onClick={() => handleClick("/sleep")}><button className="btn btn-primary"><GiNightSleep/></button></Link>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="card">
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