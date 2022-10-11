import { useState } from 'react'
import { useSleepsContext } from '../hooks/useSleepsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import useAxiosPrivate from "../hooks/useAxiosPrivate"

const SleepForm = () => {
  const axiosPrivate = useAxiosPrivate()
  const { dispatch } = useSleepsContext()
  const { user } = useAuthContext()
  const [title, setTitle] = useState('')
  const [load, setLoad] = useState('')
  const [reps, setReps] = useState('')
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      setError('You must be logged in')
      return
    }

    const sleep = {title, load, reps}
    
    try {
      const response = await axiosPrivate.post('/api/sleeps', sleep)
      setEmptyFields([])
      setError(null)
      setTitle('')
      setLoad('')
      setReps('')
      dispatch({type: 'CREATE_SLEEP', payload: response.data})
    } catch (error) {
      // console.log(error)
      setError(error.response?.data.error)
      setEmptyFields(error.response?.data.emptyFields)
    }
  }

  return (
    <form className="create" onSubmit={handleSubmit}> 
      <h3>Add New Sleep Hours</h3>
      <label>Excersize Title:</label>
      <input type="text" onChange={(e) => setTitle(e.target.value)} value={title} className={emptyFields?.includes('title') ? 'error' : ''}/>
      <label>Load (in kg):</label>
      <input type="number" onChange={(e) => setLoad(e.target.value)} value={load} className={emptyFields?.includes('load') ? 'error' : ''}/>
      <label>Number of Reps:</label>
      <input type="number" onChange={(e) => setReps(e.target.value)} value={reps} className={emptyFields?.includes('reps') ? 'error' : ''}/>
      <button>Add Sleep</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default SleepForm