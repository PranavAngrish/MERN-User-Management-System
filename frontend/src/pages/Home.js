import { Link } from 'react-router-dom'
import { ROLES } from '../config/roles'
import { usePathContext } from '../context/path'
import { useAuthContext } from '../hooks/useAuthContext'

const Home = () => {
    const { auth } = useAuthContext()
    const { setTitle, setLink } = usePathContext()

    const handleClick = (title) => {
        setTitle(title + " Management")
        setLink('/' + title.toLowerCase())
    }
    
    return (
        <>
            <h1>Welcome</h1><br/>
            {auth?.roles == ROLES.Admin && (<><Link to="/user" onClick={() => handleClick("User")}>User</Link><br/></>)}
            <Link to="/sleep" onClick={() => handleClick("Sleep")}>Sleep</Link><br/>
            <Link to="/note" onClick={() => handleClick("Note")}>Note</Link>
        </>
    )
}

export default Home