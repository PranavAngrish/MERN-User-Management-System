import { MdSpaceDashboard, MdOutlineVerifiedUser } from 'react-icons/md'
import { Link } from 'react-router-dom'

const Activate = () => {
    return (
        <div className="popup center shadow">
            <div className="icon">
                <MdOutlineVerifiedUser className="fa"/>
            </div>
            <div className="fs-3 fw-semibold">Account Activated</div>
            <div className="description">Your email has been confirmed, check dashboard for more details.</div>
            <div className="dismiss-btn mt-3">
                <Link to="/"><button><MdSpaceDashboard />&nbsp;DASHBOARD</button></Link>
            </div>
        </div>
    )
}

export default Activate