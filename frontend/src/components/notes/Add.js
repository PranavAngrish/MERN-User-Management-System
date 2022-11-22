import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BiArrowBack } from 'react-icons/bi'
import { BsPlusLg } from 'react-icons/bs'

const Add = () => {
  const navigate = useNavigate()
  
  return (
    <div className="d-flex justify-content-between">
      <button className="btn btn-outline-primary mb-2" onClick={() => navigate('/', {replace: true})}><BiArrowBack /></button>
      <button className="btn btn-outline-primary mb-2"><BsPlusLg /></button>
    </div>
  )
}

export default Add