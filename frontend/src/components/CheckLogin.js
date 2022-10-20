import { useState } from 'react'
import { Outlet, Navigate } from "react-router-dom" 
import { useAuthContext } from '../hooks/useAuthContext'

const CheckLogin = () => {
    const { auth } = useAuthContext()

    return (
        <>{auth ? <Outlet /> : <Navigate to="/login" />}</>
    )
}

export default CheckLogin