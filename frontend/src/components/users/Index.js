import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useUserContext } from '../../hooks/useUserContext'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import Edit from './Edit'
import Delete from './Delete'

const Index = () => {
  const {auth} = useAuthContext()
  const {users, dispatch} = useUserContext()
  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    let isMounted = true
    const abortController = new AbortController()

    const getAllUser = async () => {
      try {
        const response = await axiosPrivate.get('/api/users', {
          signal: abortController.signal
        })
        isMounted && dispatch({type: 'SET_USER', payload: response.data})
      } catch (err) {
        // console.log(err)
      }
    }

    if(auth){
      getAllUser()
    }

    return () => {
      isMounted = false
      abortController.abort()
    }
  }, [])

  return (
    <table className="table">
      <thead className="table-light">
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Roles</th>
          <th scope="col">Active</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        {users && users.map(user => (
          <tr key={user._id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.roles}</td>
            <td>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" checked={user.active} readOnly/>
              </div>
            </td>
            <td>
              <Edit user={user}/>
              <Delete user={user}/>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Index