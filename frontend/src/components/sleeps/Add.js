import { useEffect, useRef, useState } from 'react'
import { ROLES } from '../../config/roles'
import { useSleepsContext } from '../../hooks/useSleepsContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useUserContext } from '../../hooks/useUserContext'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
const moment = require('moment')

const Add = () => {
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuthContext()
  const { targetUser } =  useUserContext()
  const { dispatch } = useSleepsContext()
  const [ error, setError ] = useState(null)
  const [ emptyFields, setEmptyFields ] = useState([])
  const sleepRef = useRef('')
  const wakeRef = useRef('')
  const now = moment(new Date()).format('YYYY-MM-DD HH:mm')

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
    
    try {
      const rughtToAdd = auth.roles == ROLES.Admin || auth.roles == ROLES.Root
      const sleep = {sleep: sleepRef.current.value, wake: wakeRef.current.value}

      if(targetUser?.userId && (auth.email !== targetUser?.userEmail) && (rughtToAdd)){
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
      <label>Sleep Time:</label>
      <input className="inputs" type="datetime-local" ref={sleepRef}/>
      <label>Wake Time:</label>
      <input className="inputs" type="datetime-local" ref={wakeRef}/>
      <button>Add Sleep</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default Add