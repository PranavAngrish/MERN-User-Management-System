import { useEffect } from 'react'
import { usePathContext } from '../context/path'

const Note = () => {
  const { setTitle } = usePathContext()

  useEffect(() => {
    setTitle("Note Management")
  },[])
  
  return (
    <>
      <div>Note</div>
    </>
  )
}

export default Note