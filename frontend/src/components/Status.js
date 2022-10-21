import React from 'react'
import { ROLES } from '../config/roles'
import { useAuthContext } from '../hooks/useAuthContext'
import { BsFillPersonFill } from "react-icons/bs"
import { FaAddressCard } from "react-icons/fa"
import { OverlayTrigger, Tooltip} from "react-bootstrap"

const Status = () => {
  const { auth } = useAuthContext()
  let color = 'bg-primary pt-1 text-white'
  if(auth?.roles == ROLES.Admin) color = 'bg-warning pt-1'

  return (
    <>
        {auth && (<div className={color}>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>Name</Tooltip>}>
                <span className="mx-3 d-inline-flex align-items-center"><FaAddressCard className="fs-4"/>&ensp;{auth.name}</span>
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>Roles</Tooltip>}>
                <span className="d-inline-flex align-items-center"><BsFillPersonFill className="fs-4"/>&ensp;{auth.roles}</span>
            </OverlayTrigger>
        </div>)}
    </>
  )
}

export default Status