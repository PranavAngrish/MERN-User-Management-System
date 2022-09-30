import { useSleepsContext } from '../hooks/useSleepsContext'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const SleepDetails = ({ sleep }) => {
  const { dispatch } =  useSleepsContext()

  const handleDelete = async () => {
    const response = await fetch('/api/sleeps/' + sleep._id, {
      method: 'DELETE'
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({type: 'DELETE_SLEEP', payload: json})
    }
  }

    return (
      <div className="sleep-details">
        <h4>{sleep.title}</h4>
        <p><strong>Load (kg): </strong>{sleep.load}</p>
        <p><strong>Number of reps: </strong>{sleep.reps}</p>
        <p>{formatDistanceToNow(new Date(sleep.createdAt), { addSuffix: true })}</p>
        <span className="material-symbols-outlined" onClick={handleDelete}>delete</span>
      </div>
    )
  }
  
  export default SleepDetails