import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div className="home">
            <h1>Welcome</h1>
            <br/>
            <Link to="/user">User</Link>
            <Link to="/sleep">Sleep</Link>
            <Link to="/note">Note</Link>
        </div>
    )
}

export default Home