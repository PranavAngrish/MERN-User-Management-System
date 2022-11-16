import { useState } from 'react'
import Edit from './Edit'
import Delete from './Delete'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const Index = ({ sleep }) => {
//   const [error, setError] = useState(null)

  return (
    <div className="card mb-3">
        <div className="card-body d-flex justify-content-between align-items-start">
            <div>
                <div className="fs-4 mb-1 text-primary">{sleep.title}</div>
                <p>
                    <strong className="fs-6 text-muted">Sleep time: </strong>{sleep.sleep}<br/>
                    <strong className="fs-6 text-muted">Wake time: </strong>{sleep.wake}<br/>
                    {formatDistanceToNow(new Date(sleep.createdAt), { addSuffix: true })}
                </p>
            </div>
            <div>
                <Edit sleep={sleep}/>
                <Delete sleep={sleep}/>
            </div>
        </div>
        {/* <div className="mx-3">
            {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
        </div> */}
    </div>
  )
}
  
export default Index

