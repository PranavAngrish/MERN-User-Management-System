import { useEffect, useRef, useState } from 'react'
import { ROLES } from '../../config/roles'
import { useSleepsContext } from '../../hooks/useSleepsContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useUserContext } from '../../hooks/useUserContext'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const Add = () => {
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuthContext()
  const { targetUser } =  useUserContext()
  const { dispatch } = useSleepsContext()
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])
  const sleepRef = useRef('')
  const wakeRef = useRef('')
  const now = new Date().toISOString().split('.').shift()

  useEffect(() => {
    sleepRef.current.defaultValue = now
    wakeRef.current.defaultValue = now
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!auth) {
      setError('You must be logged in')
      return
    }

    const sleep = {sleep: sleepRef.current.value, wake: wakeRef.current.value}
    
    try {
      if(targetUser?.userId && (auth.email !== targetUser?.userEmail) && (auth.roles == ROLES.Admin)){
        sleep.id = targetUser.userId
      }
      const response = await axiosPrivate.post('/api/sleeps', sleep)
      setEmptyFields([])
      setError(null)
      sleepRef.current.value = now
      wakeRef.current.value = now
      dispatch({type: 'CREATE_SLEEP', payload: response.data})
    } catch (error) {
      // console.log(error)
      setError(error.response?.data.error)
      setEmptyFields(error.response?.data.emptyFields)
    }
  }

  return (
    <form className="create" onSubmit={handleSubmit}> 
      <h3>Record Sleep Hours</h3>
      {/* var time = new Date() .toLocaleTimeString("en-US") */}
      <label>Sleep Time:</label>
      <input type="datetime-local" ref={sleepRef} className={emptyFields?.includes('sleep') ? 'error' : ''}/>
      <label>Wake Time:</label>
      <input type="datetime-local" ref={wakeRef} className={emptyFields?.includes('wake') ? 'error' : ''}/>
      {/* <label>Excersize Title:</label>
      <input type="text" ref={titleRef} className={emptyFields?.includes('title') ? 'error' : ''}/>
      <label>Load (in kg):</label>
      <input type="number" ref={loadRef} className={emptyFields?.includes('load') ? 'error' : ''}/>
      <label>Number of Reps:</label>
      <input type="number" ref={repsRef} className={emptyFields?.includes('reps') ? 'error' : ''}/> */}
      <button>Add Sleep</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default Add