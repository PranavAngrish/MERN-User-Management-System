import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div className="home">
            <h1>Welcome</h1>
            <br/>
            <Link to="/sleep">sleep</Link>
        </div>
    )
}

export default Home