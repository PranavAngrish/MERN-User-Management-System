import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <>
        <div>404 - Not Found</div>
        <Link to="/">Back to home</Link>
    </>
  )
}

export default NotFound