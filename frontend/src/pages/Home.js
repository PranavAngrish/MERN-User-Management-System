import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <>
            <h1>Welcome</h1>
            <br/>
            <Link to="/user">User</Link><br/>
            <Link to="/sleep">Sleep</Link><br/>
            <Link to="/note">Note</Link>
        </>
    )
}

export default Home