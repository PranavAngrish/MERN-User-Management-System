import { Link } from 'react-router-dom'
import { useTitleContext } from '../context/title'

const Home = () => {
    const { setTitle } = useTitleContext()
    return (
        <>
            <h1>Welcome</h1>
            <br/>
            <Link to="/user" onClick={e => setTitle("User Management")}>User</Link><br/>
            <Link to="/sleep" onClick={e => setTitle("Sleep Management")}>Sleep</Link><br/>
            <Link to="/note" onClick={e => setTitle("Note Management")}>Note</Link>
        </>
    )
}

export default Home