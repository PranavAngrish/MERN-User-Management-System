import { Link } from 'react-router-dom'
import { ROLES } from '../config/roles'
import { useTitleContext } from '../context/title'
import { useAuthContext } from '../hooks/useAuthContext'

const Home = () => {
    const { auth } = useAuthContext()
    const { setTitle } = useTitleContext()
    

    return (
        <>
            <h1>Welcome</h1><br/>
            {auth?.roles == ROLES.Admin && (<><Link to="/user" onClick={e => setTitle("User Management")}>User</Link><br/></>)}
            <Link to="/sleep" onClick={e => setTitle("Sleep Management")}>Sleep</Link><br/>
            <Link to="/note" onClick={e => setTitle("Note Management")}>Note</Link>
        </>
    )
}

export default Home