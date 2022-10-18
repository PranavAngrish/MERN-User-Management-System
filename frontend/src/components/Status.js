import React from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { BsFillPersonFill } from "react-icons/bs"
import { FaAddressCard } from "react-icons/fa"
import { Button, OverlayTrigger, Tooltip} from "react-bootstrap"

const Status = () => {
  const { auth } = useAuthContext()

  return (
    <>
        {auth && (<div className="bg-warning p-2">
            <OverlayTrigger placement="bottom" overlay={<Tooltip>Name</Tooltip>}>
                <span className="mx-3"><FaAddressCard className="fs-4"/>&ensp;{auth.name}</span>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>Roles</Tooltip>}>
                <span><BsFillPersonFill className="fs-4"/>&ensp;{auth.roles}</span>
            </OverlayTrigger>
        </div>)}
    </>
  )
}

export default Status