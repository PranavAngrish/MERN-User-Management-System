import { useRef, useState } from 'react'
import { useSleepsContext } from '../../hooks/useSleepsContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const Add = () => {
  const { auth } = useAuthContext()
  const axiosPrivate = useAxiosPrivate()
  const { dispatch } = useSleepsContext()
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])
  const titleRef = useRef('')
  const loadRef = useRef('')
  const repsRef = useRef('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!auth) {
      setError('You must be logged in')
      return
    }

    const sleep = {title: titleRef.current.value, load: loadRef.current.value, reps: repsRef.current.value}
    
    try {
      const response = await axiosPrivate.post('/api/sleeps', sleep)
      setEmptyFields([])
      setError(null)
      titleRef.current.value = ''
      loadRef.current.value = ''
      repsRef.current.value = ''
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
      <input type="text" ref={titleRef} className={emptyFields?.includes('title') ? 'error' : ''}/>
      <label>Load (in kg):</label>
      <input type="number" ref={loadRef} className={emptyFields?.includes('load') ? 'error' : ''}/>
      <label>Number of Reps:</label>
      <input type="number" ref={repsRef} className={emptyFields?.includes('reps') ? 'error' : ''}/>
      <button>Add Sleep</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default Add